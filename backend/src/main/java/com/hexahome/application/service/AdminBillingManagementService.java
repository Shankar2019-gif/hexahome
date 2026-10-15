package com.hexahome.application.service;

import com.hexahome.application.dto.admin.billing.*;
import com.hexahome.application.port.in.AdminBillingManagementUseCase;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.policy.SubscriptionPolicy;
import com.hexahome.persistence.entity.Payment;
import com.hexahome.persistence.entity.Plan;
import com.hexahome.persistence.entity.Subscription;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PaymentRepository;
import com.hexahome.persistence.repository.SubscriptionRepository;
import com.hexahome.persistence.specification.AdminPaymentSpecification;
import com.hexahome.persistence.specification.AdminSubscriptionSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
public class AdminBillingManagementService implements AdminBillingManagementUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminBillingManagementService.class);
    private static final Set<String> ALLOWED_SUBSCRIPTION_SORT = Set.of("startsAt", "expiresAt", "status", "totalCredits", "remainingCredits");
    private static final Set<String> ALLOWED_PAYMENT_SORT = Set.of("createdAt", "amountInr", "status", "gateway");

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final AuditLogPort auditLogPort;

    public AdminBillingManagementService(
            SubscriptionRepository subscriptionRepository,
            PaymentRepository paymentRepository,
            AuditLogPort auditLogPort) {
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRepository = paymentRepository;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminSubscriptionSummaryDto> searchSubscriptions(AdminSubscriptionFilterRequest request) {
        String safeSort = ALLOWED_SUBSCRIPTION_SORT.contains(request.getSortBy()) ? request.getSortBy() : "startsAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(request.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), Sort.by(direction, safeSort));

        Specification<Subscription> spec = AdminSubscriptionSpecification.build(request);
        Page<Subscription> subscriptionPage = subscriptionRepository.findAll(spec, pageable);

        return subscriptionPage.map(this::mapToSubscriptionSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminSubscriptionDetailDto getSubscriptionDetail(UUID subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        AdminSubscriptionDetailDto dto = new AdminSubscriptionDetailDto();
        dto.setId(subscription.getId());

        User user = subscription.getUser();
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUserName(user.getName());
            dto.setMaskedUserPhone(maskPhone(user.getPhone()));
            dto.setMaskedUserEmail(maskEmail(user.getEmail()));
        }

        Plan plan = subscription.getPlan();
        if (plan != null) {
            dto.setPlanId(plan.getId());
            dto.setPlanName(plan.getName());
            dto.setTargetRole(plan.getTargetRole());
            dto.setPlanPrice(plan.getPriceInr());
            dto.setValidityDays(plan.getValidityDays());
            dto.setHasAssistedManager(plan.isHasAssistedManager());
            dto.setInstantWhatsappAlerts(plan.isInstantWhatsappAlerts());
        }

        dto.setTotalCredits(subscription.getTotalCredits());
        dto.setRemainingCredits(subscription.getRemainingCredits());
        dto.setUsedCredits(Math.max(0, subscription.getTotalCredits() - subscription.getRemainingCredits()));
        dto.setStartsAt(subscription.getStartsAt());
        dto.setExpiresAt(subscription.getExpiresAt());
        dto.setStatus(subscription.getStatus());
        dto.setExpired(subscription.isExpired());

        return dto;
    }

    @Override
    @Transactional
    public void extendSubscription(UUID subscriptionId, ExtendSubscriptionRequest request, UUID adminId, String ipAddress) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        SubscriptionPolicy.validateExtension(subscription.getStatus(), request.getAdditionalDays());

        Instant previousExpiresAt = subscription.getExpiresAt();
        Instant baseTime = Instant.now().isAfter(previousExpiresAt) ? Instant.now() : previousExpiresAt;
        Instant newExpiresAt = baseTime.plus(Duration.ofDays(request.getAdditionalDays()));

        subscription.setExpiresAt(newExpiresAt);
        if (SubscriptionPolicy.STATUS_EXPIRED.equalsIgnoreCase(subscription.getStatus())) {
            subscription.setStatus(SubscriptionPolicy.STATUS_ACTIVE);
        }
        subscriptionRepository.save(subscription);

        auditLogPort.recordAction(
                adminId,
                "EXTEND_SUBSCRIPTION",
                "SUBSCRIPTION",
                subscriptionId.toString(),
                previousExpiresAt.toString(),
                newExpiresAt.toString(),
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Subscription {} extended by {} days to {} by admin {}", subscriptionId, request.getAdditionalDays(), newExpiresAt, adminId);
    }

    @Override
    @Transactional
    public void cancelSubscription(UUID subscriptionId, CancelSubscriptionRequest request, UUID adminId, String ipAddress) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        SubscriptionPolicy.validateCancellation(subscription.getStatus());

        String previousStatus = subscription.getStatus();
        subscription.setStatus(SubscriptionPolicy.STATUS_CANCELLED);
        subscriptionRepository.save(subscription);

        auditLogPort.recordAction(
                adminId,
                "CANCEL_SUBSCRIPTION",
                "SUBSCRIPTION",
                subscriptionId.toString(),
                previousStatus,
                SubscriptionPolicy.STATUS_CANCELLED,
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Subscription {} cancelled by admin {} with reason: {}", subscriptionId, adminId, request.getReason());
    }

    @Override
    @Transactional
    public void manualGrantCredits(UUID subscriptionId, ManualGrantCreditsRequest request, UUID adminId, String ipAddress) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + subscriptionId));

        SubscriptionPolicy.validateCreditGrant(request.getCreditsToAdd());

        int previousRemaining = subscription.getRemainingCredits();
        int previousTotal = subscription.getTotalCredits();
        int newRemaining = previousRemaining + request.getCreditsToAdd();
        int newTotal = previousTotal + request.getCreditsToAdd();

        subscription.setRemainingCredits(newRemaining);
        subscription.setTotalCredits(newTotal);
        subscriptionRepository.save(subscription);

        auditLogPort.recordAction(
                adminId,
                "GRANT_SUBSCRIPTION_CREDITS",
                "SUBSCRIPTION",
                subscriptionId.toString(),
                String.valueOf(previousRemaining),
                String.valueOf(newRemaining),
                request.getReason(),
                ipAddress,
                "SUCCESS"
        );

        log.info("Granted {} credits to subscription {} (new total: {}, remaining: {}) by admin {}",
                request.getCreditsToAdd(), subscriptionId, newTotal, newRemaining, adminId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminPaymentSummaryDto> searchPayments(AdminPaymentFilterRequest request) {
        String safeSort = ALLOWED_PAYMENT_SORT.contains(request.getSortBy()) ? request.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(request.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), Sort.by(direction, safeSort));

        Specification<Payment> spec = AdminPaymentSpecification.build(request);
        Page<Payment> paymentPage = paymentRepository.findAll(spec, pageable);

        return paymentPage.map(this::mapToPaymentSummaryDto);
    }

    private AdminSubscriptionSummaryDto mapToSubscriptionSummaryDto(Subscription subscription) {
        AdminSubscriptionSummaryDto dto = new AdminSubscriptionSummaryDto();
        dto.setId(subscription.getId());
        if (subscription.getUser() != null) {
            dto.setUserId(subscription.getUser().getId());
            dto.setUserName(subscription.getUser().getName());
            dto.setMaskedUserPhone(maskPhone(subscription.getUser().getPhone()));
        }
        if (subscription.getPlan() != null) {
            dto.setPlanId(subscription.getPlan().getId());
            dto.setPlanName(subscription.getPlan().getName());
            dto.setPlanPrice(subscription.getPlan().getPriceInr());
        }
        dto.setTotalCredits(subscription.getTotalCredits());
        dto.setRemainingCredits(subscription.getRemainingCredits());
        dto.setStartsAt(subscription.getStartsAt());
        dto.setExpiresAt(subscription.getExpiresAt());
        dto.setStatus(subscription.getStatus());
        dto.setExpired(subscription.isExpired());
        return dto;
    }

    private AdminPaymentSummaryDto mapToPaymentSummaryDto(Payment payment) {
        AdminPaymentSummaryDto dto = new AdminPaymentSummaryDto();
        dto.setId(payment.getId());
        if (payment.getUser() != null) {
            dto.setUserId(payment.getUser().getId());
            dto.setUserName(payment.getUser().getName());
            dto.setMaskedUserPhone(maskPhone(payment.getUser().getPhone()));
        }
        if (payment.getSubscription() != null) {
            dto.setSubscriptionId(payment.getSubscription().getId());
        }
        dto.setOrderId(payment.getOrderId());
        dto.setPaymentId(payment.getPaymentId());
        dto.setGateway(payment.getGateway());
        dto.setAmountInr(payment.getAmountInr());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }

    private String maskPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return "***";
        }
        String trimmed = phone.trim();
        if (trimmed.length() <= 4) {
            return "****";
        }
        String lastFour = trimmed.substring(trimmed.length() - 4);
        return "*".repeat(trimmed.length() - 4) + lastFour;
    }

    private String maskEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return "***";
        }
        String trimmed = email.trim();
        int atIndex = trimmed.indexOf('@');
        if (atIndex <= 1) {
            return "***" + (atIndex >= 0 ? trimmed.substring(atIndex) : "");
        }
        String local = trimmed.substring(0, atIndex);
        String domain = trimmed.substring(atIndex);
        return local.charAt(0) + "*".repeat(Math.max(1, local.length() - 1)) + domain;
    }
}
