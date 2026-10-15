package com.hexahome.application.service;

import com.hexahome.application.dto.admin.billing.*;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.policy.SubscriptionPolicy;
import com.hexahome.persistence.entity.Payment;
import com.hexahome.persistence.entity.Plan;
import com.hexahome.persistence.entity.Subscription;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PaymentRepository;
import com.hexahome.persistence.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminBillingManagementServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminBillingManagementService billingService;

    private User testUser;
    private Plan testPlan;
    private Subscription testSubscription;
    private Payment testPayment;
    private UUID subscriptionId;
    private UUID userId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        billingService = new AdminBillingManagementService(
                subscriptionRepository,
                paymentRepository,
                auditLogPort
        );

        subscriptionId = UUID.randomUUID();
        userId = UUID.randomUUID();
        adminId = UUID.randomUUID();

        testUser = new User();
        testUser.setId(userId);
        testUser.setName("Bob Owner");
        testUser.setPhone("9876543210");
        testUser.setEmail("bob.owner@example.com");

        testPlan = new Plan("PLAN_OWNER_PRO", "Owner Pro Plan", "OWNER", new BigDecimal("1999"), 60, 50);

        testSubscription = new Subscription();
        testSubscription.setId(subscriptionId);
        testSubscription.setUser(testUser);
        testSubscription.setPlan(testPlan);
        testSubscription.setTotalCredits(50);
        testSubscription.setRemainingCredits(35);
        testSubscription.setStartsAt(Instant.now().minus(10, ChronoUnit.DAYS));
        testSubscription.setExpiresAt(Instant.now().plus(50, ChronoUnit.DAYS));
        testSubscription.setStatus(SubscriptionPolicy.STATUS_ACTIVE);

        testPayment = new Payment();
        testPayment.setId(UUID.randomUUID());
        testPayment.setUser(testUser);
        testPayment.setSubscription(testSubscription);
        testPayment.setOrderId("order_12345");
        testPayment.setPaymentId("pay_67890");
        testPayment.setGateway("RAZORPAY");
        testPayment.setAmountInr(new BigDecimal("1999"));
        testPayment.setStatus("SUCCESS");
        testPayment.setCreatedAt(Instant.now());
    }

    @Test
    void searchSubscriptions_Success() {
        AdminSubscriptionFilterRequest request = new AdminSubscriptionFilterRequest();
        request.setPage(0);
        request.setSize(10);

        Page<Subscription> page = new PageImpl<>(List.of(testSubscription));
        when(subscriptionRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<AdminSubscriptionSummaryDto> result = billingService.searchSubscriptions(request);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AdminSubscriptionSummaryDto summary = result.getContent().get(0);
        assertEquals(subscriptionId, summary.getId());
        assertEquals("Bob Owner", summary.getUserName());
        assertTrue(summary.getMaskedUserPhone().endsWith("3210"));
        assertEquals("Owner Pro Plan", summary.getPlanName());
        assertEquals(50, summary.getTotalCredits());
        assertEquals(35, summary.getRemainingCredits());
    }

    @Test
    void getSubscriptionDetail_Success() {
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));

        AdminSubscriptionDetailDto detail = billingService.getSubscriptionDetail(subscriptionId);

        assertNotNull(detail);
        assertEquals(subscriptionId, detail.getId());
        assertEquals(userId, detail.getUserId());
        assertEquals("Bob Owner", detail.getUserName());
        assertTrue(detail.getMaskedUserPhone().endsWith("3210"));
        assertTrue(detail.getMaskedUserEmail().contains("@example.com"));
        assertEquals(15, detail.getUsedCredits());
        assertEquals(50, detail.getTotalCredits());
        assertEquals(35, detail.getRemainingCredits());
    }

    @Test
    void getSubscriptionDetail_NotFound_ThrowsException() {
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> billingService.getSubscriptionDetail(subscriptionId));
    }

    @Test
    void extendSubscription_Success() {
        ExtendSubscriptionRequest request = new ExtendSubscriptionRequest(30, "Customer courtesy extension");
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));
        Instant initialExpiry = testSubscription.getExpiresAt();

        billingService.extendSubscription(subscriptionId, request, adminId, "127.0.0.1");

        assertTrue(testSubscription.getExpiresAt().isAfter(initialExpiry));
        verify(subscriptionRepository).save(testSubscription);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("EXTEND_SUBSCRIPTION"),
                eq("SUBSCRIPTION"),
                eq(subscriptionId.toString()),
                eq(initialExpiry.toString()),
                eq(testSubscription.getExpiresAt().toString()),
                eq("Customer courtesy extension"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void extendSubscription_Cancelled_ThrowsBadRequestException() {
        testSubscription.setStatus(SubscriptionPolicy.STATUS_CANCELLED);
        ExtendSubscriptionRequest request = new ExtendSubscriptionRequest(15, "Attempt extension");
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));

        assertThrows(BadRequestException.class, () ->
                billingService.extendSubscription(subscriptionId, request, adminId, "127.0.0.1"));
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void cancelSubscription_Success() {
        CancelSubscriptionRequest request = new CancelSubscriptionRequest("User requested plan cancellation");
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));

        billingService.cancelSubscription(subscriptionId, request, adminId, "127.0.0.1");

        assertEquals(SubscriptionPolicy.STATUS_CANCELLED, testSubscription.getStatus());
        verify(subscriptionRepository).save(testSubscription);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("CANCEL_SUBSCRIPTION"),
                eq("SUBSCRIPTION"),
                eq(subscriptionId.toString()),
                eq(SubscriptionPolicy.STATUS_ACTIVE),
                eq(SubscriptionPolicy.STATUS_CANCELLED),
                eq("User requested plan cancellation"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void cancelSubscription_AlreadyCancelled_ThrowsBadRequestException() {
        testSubscription.setStatus(SubscriptionPolicy.STATUS_CANCELLED);
        CancelSubscriptionRequest request = new CancelSubscriptionRequest("Cancel again");
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));

        assertThrows(BadRequestException.class, () ->
                billingService.cancelSubscription(subscriptionId, request, adminId, "127.0.0.1"));
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void manualGrantCredits_Success() {
        ManualGrantCreditsRequest request = new ManualGrantCreditsRequest(25, "Compensation for system downtime");
        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(testSubscription));

        billingService.manualGrantCredits(subscriptionId, request, adminId, "127.0.0.1");

        assertEquals(75, testSubscription.getTotalCredits());
        assertEquals(60, testSubscription.getRemainingCredits());
        verify(subscriptionRepository).save(testSubscription);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("GRANT_SUBSCRIPTION_CREDITS"),
                eq("SUBSCRIPTION"),
                eq(subscriptionId.toString()),
                eq("35"),
                eq("60"),
                eq("Compensation for system downtime"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void searchPayments_Success() {
        AdminPaymentFilterRequest request = new AdminPaymentFilterRequest();
        request.setPage(0);
        request.setSize(10);

        Page<Payment> page = new PageImpl<>(List.of(testPayment));
        when(paymentRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<AdminPaymentSummaryDto> result = billingService.searchPayments(request);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        AdminPaymentSummaryDto summary = result.getContent().get(0);
        assertEquals("order_12345", summary.getOrderId());
        assertEquals("pay_67890", summary.getPaymentId());
        assertEquals("RAZORPAY", summary.getGateway());
        assertEquals(new BigDecimal("1999"), summary.getAmountInr());
        assertEquals("SUCCESS", summary.getStatus());
        assertEquals("Bob Owner", summary.getUserName());
    }
}
