package com.hexahome.application.service;

import com.hexahome.application.dto.billing.CreateOrderRequest;
import com.hexahome.application.dto.billing.OrderResponseDto;
import com.hexahome.application.dto.billing.PaymentVerificationResponseDto;
import com.hexahome.application.dto.billing.VerifyPaymentRequest;
import com.hexahome.application.port.out.OrderResult;
import com.hexahome.application.port.out.PaymentGatewayPort;
import com.hexahome.application.service.impl.PaymentServiceImpl;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Payment Service Unit Tests")
class PaymentServiceTest {

    @Mock
    private PaymentGatewayPort paymentGatewayPort;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PlanRepository planRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User testUser;
    private Plan testPlan;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(userId);
        testUser.setPhone("+919876543210");
        testUser.setEmail("tenant@example.com");

        testPlan = new Plan("plan_tenant_pro", "Tenant Pro", "TENANT", BigDecimal.valueOf(999.00), 30, 25);
    }

    @Test
    @DisplayName("createOrder succeeds and persists PENDING payment")
    void testCreateOrder_Success() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setPlanId("plan_tenant_pro");
        request.setCurrency("INR");

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(planRepository.findById("plan_tenant_pro")).thenReturn(Optional.of(testPlan));
        when(paymentGatewayPort.createOrder(anyString(), eq(BigDecimal.valueOf(999.00)), eq("INR")))
                .thenReturn(new OrderResult("order_test_12345", BigDecimal.valueOf(999.00), "INR", "RAZORPAY", "rzp_test_Tnhdqxkz85pAVO"));
        when(paymentGatewayPort.getGatewayName()).thenReturn("RAZORPAY");

        OrderResponseDto response = paymentService.createOrder(userId, request);

        assertNotNull(response);
        assertEquals("order_test_12345", response.getOrderId());
        assertEquals(BigDecimal.valueOf(999.00), response.getAmountInr());
        assertEquals("RAZORPAY", response.getGateway());
        assertEquals("rzp_test_Tnhdqxkz85pAVO", response.getKeyId());

        ArgumentCaptor<Payment> paymentCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentCaptor.capture());
        Payment savedPayment = paymentCaptor.getValue();
        assertEquals("order_test_12345", savedPayment.getOrderId());
        assertEquals("PENDING", savedPayment.getStatus());
        assertEquals("RAZORPAY", savedPayment.getGateway());
    }

    @Test
    @DisplayName("createOrder throws ResourceNotFoundException when user does not exist")
    void testCreateOrder_UserNotFound() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setPlanId("plan_tenant_pro");

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> paymentService.createOrder(userId, request));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyPayment succeeds with valid signature and activates subscription credits")
    void testVerifyPayment_Success() {
        VerifyPaymentRequest request = new VerifyPaymentRequest("order_test_12345", "pay_test_67890", "valid_signature_abc");

        Payment pendingPayment = new Payment(testUser, null, "order_test_12345", "RAZORPAY", BigDecimal.valueOf(999.00), "PENDING");

        when(paymentRepository.findByOrderId("order_test_12345")).thenReturn(Optional.of(pendingPayment));
        when(paymentGatewayPort.verifySignature("order_test_12345", "pay_test_67890", "valid_signature_abc")).thenReturn(true);
        when(planRepository.findAllByIsActiveTrue()).thenReturn(java.util.List.of(testPlan));
        when(subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(userId, "ACTIVE")).thenReturn(Optional.empty());

        Subscription newSub = new Subscription(testUser, testPlan, 25, 25, Instant.now(), Instant.now().plusSeconds(86400 * 30));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(newSub);

        PaymentVerificationResponseDto result = paymentService.verifyPayment(userId, request);

        assertNotNull(result);
        assertEquals("COMPLETED", result.getStatus());
        assertEquals("pay_test_67890", result.getPaymentId());
        assertEquals(25, result.getCreditsAdded());
        assertEquals(25, result.getTotalRemainingCredits());
        assertEquals("COMPLETED", pendingPayment.getStatus());
        assertEquals("pay_test_67890", pendingPayment.getPaymentId());
        verify(paymentRepository).save(pendingPayment);
    }

    @Test
    @DisplayName("verifyPayment marks payment FAILED and throws BadRequestException on signature mismatch")
    void testVerifyPayment_InvalidSignature() {
        VerifyPaymentRequest request = new VerifyPaymentRequest("order_test_12345", "pay_test_67890", "forged_signature");

        Payment pendingPayment = new Payment(testUser, null, "order_test_12345", "RAZORPAY", BigDecimal.valueOf(999.00), "PENDING");

        when(paymentRepository.findByOrderId("order_test_12345")).thenReturn(Optional.of(pendingPayment));
        when(paymentGatewayPort.verifySignature("order_test_12345", "pay_test_67890", "forged_signature")).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> paymentService.verifyPayment(userId, request));
        assertTrue(ex.getMessage().contains("Payment signature verification failed"));

        assertEquals("FAILED", pendingPayment.getStatus());
        verify(paymentRepository).save(pendingPayment);
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyPayment throws BadRequestException when unauthorized user attempts verification")
    void testVerifyPayment_UnauthorizedUser() {
        VerifyPaymentRequest request = new VerifyPaymentRequest("order_test_12345", "pay_test_67890", "valid_signature");
        User differentUser = new User();
        differentUser.setId(UUID.randomUUID());
        Payment payment = new Payment(differentUser, null, "order_test_12345", "RAZORPAY", BigDecimal.valueOf(999.00), "PENDING");

        when(paymentRepository.findByOrderId("order_test_12345")).thenReturn(Optional.of(payment));

        assertThrows(BadRequestException.class, () -> paymentService.verifyPayment(userId, request));
    }

    @Test
    @DisplayName("handleWebhookEvent reconciles payment.captured event idempotently")
    void testHandleWebhookEvent_PaymentCaptured() {
        String payload = "{" +
                "\"event\":\"payment.captured\"," +
                "\"payload\":{" +
                "  \"payment\":{" +
                "    \"entity\":{" +
                "      \"id\":\"pay_webhook_999\"," +
                "      \"order_id\":\"order_test_12345\"" +
                "    }" +
                "  }" +
                "}" +
                "}";
        String signature = "valid_wh_signature";

        Payment pendingPayment = new Payment(testUser, null, "order_test_12345", "RAZORPAY", BigDecimal.valueOf(999.00), "PENDING");

        when(paymentGatewayPort.verifyWebhookSignature(payload, signature)).thenReturn(true);
        when(paymentRepository.findByOrderId("order_test_12345")).thenReturn(Optional.of(pendingPayment));
        when(planRepository.findAllByIsActiveTrue()).thenReturn(java.util.List.of(testPlan));
        when(subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(userId, "ACTIVE")).thenReturn(Optional.empty());

        Subscription savedSub = new Subscription(testUser, testPlan, 25, 25, Instant.now(), Instant.now().plusSeconds(86400 * 30));
        when(subscriptionRepository.save(any(Subscription.class))).thenReturn(savedSub);

        paymentService.handleWebhookEvent(payload, signature);

        assertEquals("COMPLETED", pendingPayment.getStatus());
        assertEquals("pay_webhook_999", pendingPayment.getPaymentId());
        verify(paymentRepository).save(pendingPayment);
    }

    @Test
    @DisplayName("handleWebhookEvent skips already COMPLETED payment to guarantee idempotency")
    void testHandleWebhookEvent_Idempotency() {
        String payload = "{" +
                "\"event\":\"payment.captured\"," +
                "\"payload\":{" +
                "  \"payment\":{" +
                "    \"entity\":{" +
                "      \"id\":\"pay_webhook_999\"," +
                "      \"order_id\":\"order_test_12345\"" +
                "    }" +
                "  }" +
                "}" +
                "}";
        String signature = "valid_wh_signature";

        Payment completedPayment = new Payment(testUser, null, "order_test_12345", "RAZORPAY", BigDecimal.valueOf(999.00), "COMPLETED");

        when(paymentGatewayPort.verifyWebhookSignature(payload, signature)).thenReturn(true);
        when(paymentRepository.findByOrderId("order_test_12345")).thenReturn(Optional.of(completedPayment));

        paymentService.handleWebhookEvent(payload, signature);

        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    @DisplayName("handleWebhookEvent throws BadRequestException when signature is invalid")
    void testHandleWebhookEvent_InvalidSignature() {
        String payload = "{\"event\":\"payment.captured\"}";
        String signature = "forged_signature";

        when(paymentGatewayPort.verifyWebhookSignature(payload, signature)).thenReturn(false);

        assertThrows(BadRequestException.class, () -> paymentService.handleWebhookEvent(payload, signature));
        verify(paymentRepository, never()).findByOrderId(anyString());
    }
}
