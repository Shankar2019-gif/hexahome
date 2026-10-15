package com.hexahome.application.service.impl;

import com.hexahome.application.dto.billing.*;
import com.hexahome.application.port.out.OrderResult;
import com.hexahome.application.port.out.PaymentGatewayPort;
import com.hexahome.application.service.PaymentService;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.persistence.entity.Payment;
import com.hexahome.persistence.entity.Plan;
import com.hexahome.persistence.entity.Subscription;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PaymentRepository;
import com.hexahome.persistence.repository.PlanRepository;
import com.hexahome.persistence.repository.SubscriptionRepository;
import com.hexahome.persistence.repository.UserRepository;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private final SecureRandom random = new SecureRandom();

    private final PaymentGatewayPort paymentGatewayPort;
    private final PaymentRepository paymentRepository;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public PaymentServiceImpl(
            PaymentGatewayPort paymentGatewayPort,
            PaymentRepository paymentRepository,
            PlanRepository planRepository,
            UserRepository userRepository,
            SubscriptionRepository subscriptionRepository) {
        this.paymentGatewayPort = paymentGatewayPort;
        this.paymentRepository = paymentRepository;
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(UUID userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Plan plan = null;
        BigDecimal amount;

        if (request.getPlanId() != null && !request.getPlanId().isBlank()) {
            plan = planRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plan", "id", request.getPlanId()));
            amount = request.getAmount() != null ? request.getAmount() : plan.getPriceInr();
        } else if (request.getAmount() != null && request.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            amount = request.getAmount();
            plan = findMatchingPlan(amount);
        } else {
            throw new BadRequestException("Either planId or amount is required to create an order");
        }

        String currency = request.getCurrency() != null ? request.getCurrency() : "INR";
        String internalReceipt = generateReceiptId();

        OrderResult orderResult = paymentGatewayPort.createOrder(internalReceipt, amount, currency);

        Payment payment = new Payment(
                user,
                null,
                orderResult.orderId(),
                paymentGatewayPort.getGatewayName(),
                amount,
                "PENDING"
        );
        paymentRepository.save(payment);

        log.info("Payment order initiated: razorpayOrderId={}, userId={}, plan={}, amount={}",
                orderResult.orderId(), userId, plan != null ? plan.getId() : "custom", amount);

        return new OrderResponseDto(
                orderResult.orderId(),
                amount,
                orderResult.currency(),
                orderResult.gateway(),
                orderResult.keyId(),
                plan != null ? PlanDto.fromEntity(plan) : null
        );
    }

    @Override
    @Transactional
    public PaymentVerificationResponseDto verifyPayment(UUID userId, VerifyPaymentRequest request) {
        String orderId = request.getEffectiveOrderId();
        String paymentId = request.getEffectivePaymentId();
        String signature = request.getEffectiveSignature();

        if (orderId == null || orderId.isBlank()
                || paymentId == null || paymentId.isBlank()
                || signature == null || signature.isBlank()) {
            throw new BadRequestException("Missing required payment verification parameters: order_id, payment_id, or signature");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment order", "orderId", orderId));

        if (userId != null && !payment.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized attempt to verify payment order belonging to another user");
        }

        // Verify gateway cryptographic signature
        boolean isValid = paymentGatewayPort.verifySignature(orderId, paymentId, signature);

        if (!isValid) {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment signature verification failed. Transaction flagged as invalid.");
        }

        // Idempotency check: if already completed, return existing subscription
        if (("COMPLETED".equalsIgnoreCase(payment.getStatus()) || "SUCCESS".equalsIgnoreCase(payment.getStatus()))
                && payment.getSubscription() != null) {
            Subscription existingSub = payment.getSubscription();
            return new PaymentVerificationResponseDto(
                    payment.getPaymentId(),
                    payment.getOrderId(),
                    "COMPLETED",
                    existingSub.getPlan().getName(),
                    0,
                    existingSub.getRemainingCredits(),
                    existingSub.getExpiresAt()
            );
        }

        Plan plan = findMatchingPlan(payment.getAmountInr());

        payment.setPaymentId(paymentId);
        payment.setStatus("COMPLETED");

        Subscription savedSubscription = activateUserSubscription(payment.getUser(), plan);
        payment.setSubscription(savedSubscription);
        paymentRepository.save(payment);

        log.info("Payment verified and completed: paymentId={}, orderId={}, creditsAdded={}, totalRemaining={}",
                paymentId, orderId, plan.getContactCredits(), savedSubscription.getRemainingCredits());

        return new PaymentVerificationResponseDto(
                payment.getPaymentId(),
                payment.getOrderId(),
                "COMPLETED",
                plan.getName(),
                plan.getContactCredits(),
                savedSubscription.getRemainingCredits(),
                savedSubscription.getExpiresAt()
        );
    }

    @Override
    @Transactional
    public void handleWebhookEvent(String rawPayload, String signature) {
        if (rawPayload == null || rawPayload.isBlank()) {
            throw new BadRequestException("Webhook payload cannot be empty");
        }

        boolean isValid = paymentGatewayPort.verifyWebhookSignature(rawPayload, signature);
        if (!isValid) {
            log.warn("Invalid webhook signature received: {}", signature);
            throw new BadRequestException("Invalid Razorpay webhook signature");
        }

        JSONObject eventJson = new JSONObject(rawPayload);
        String event = eventJson.optString("event");
        log.info("Processing Razorpay webhook event: {}", event);

        JSONObject payloadObj = eventJson.optJSONObject("payload");
        JSONObject paymentObj = payloadObj != null ? payloadObj.optJSONObject("payment") : null;
        JSONObject paymentEntity = paymentObj != null ? paymentObj.optJSONObject("entity") : null;

        if (paymentEntity == null) {
            log.warn("Webhook payload does not contain payment entity: {}", rawPayload);
            return;
        }

        String orderId = paymentEntity.optString("order_id");
        String paymentId = paymentEntity.optString("id");

        if (orderId == null || orderId.isBlank()) {
            log.warn("Webhook payment entity missing order_id");
            return;
        }

        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isEmpty()) {
            log.warn("Webhook: Order ID {} not found in system", orderId);
            return;
        }

        Payment payment = paymentOpt.get();

        if ("payment.captured".equalsIgnoreCase(event)) {
            if ("COMPLETED".equalsIgnoreCase(payment.getStatus()) || "SUCCESS".equalsIgnoreCase(payment.getStatus())) {
                log.info("Webhook: Order {} already reconciled as COMPLETED. Skipping duplicate event.", orderId);
                return;
            }

            payment.setPaymentId(paymentId);
            payment.setStatus("COMPLETED");

            Plan plan = findMatchingPlan(payment.getAmountInr());
            Subscription sub = activateUserSubscription(payment.getUser(), plan);
            payment.setSubscription(sub);
            paymentRepository.save(payment);

            log.info("Webhook: Order {} successfully reconciled and activated via payment.captured", orderId);

        } else if ("payment.failed".equalsIgnoreCase(event)) {
            if ("PENDING".equalsIgnoreCase(payment.getStatus())) {
                payment.setPaymentId(paymentId);
                payment.setStatus("FAILED");
                paymentRepository.save(payment);
                log.info("Webhook: Order {} marked as FAILED via payment.failed", orderId);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentHistoryDto> getUserPaymentHistory(UUID userId) {
        return paymentRepository.findAllByUserIdWithDetails(userId)
                .stream()
                .map(PaymentHistoryDto::fromEntity)
                .toList();
    }

    private Subscription activateUserSubscription(User user, Plan plan) {
        Instant now = Instant.now();
        Optional<Subscription> activeSub = subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(user.getId(), "ACTIVE");

        Subscription subscription;
        if (activeSub.isPresent() && !activeSub.get().isExpired()) {
            subscription = activeSub.get();
            subscription.setPlan(plan);
            subscription.setRemainingCredits(subscription.getRemainingCredits() + plan.getContactCredits());
            subscription.setTotalCredits(subscription.getTotalCredits() + plan.getContactCredits());
            subscription.setExpiresAt(subscription.getExpiresAt().plus(plan.getValidityDays(), ChronoUnit.DAYS));
        } else {
            subscription = new Subscription(
                    user,
                    plan,
                    plan.getContactCredits(),
                    plan.getContactCredits(),
                    now,
                    now.plus(plan.getValidityDays(), ChronoUnit.DAYS)
            );
        }
        return subscriptionRepository.save(subscription);
    }

    private Plan findMatchingPlan(BigDecimal amount) {
        if (amount == null) {
            return planRepository.findById("plan_tenant_pro")
                    .orElseThrow(() -> new ResourceNotFoundException("Default plan not found"));
        }
        return planRepository.findAllByIsActiveTrue()
                .stream()
                .filter(p -> p.getPriceInr().compareTo(amount) == 0)
                .findFirst()
                .orElseGet(() -> planRepository.findById("plan_tenant_pro")
                        .orElseThrow(() -> new ResourceNotFoundException("Default plan not found")));
    }

    private String generateReceiptId() {
        return "rcpt_" + System.currentTimeMillis() + "_" + (random.nextInt(9000) + 1000);
    }
}
