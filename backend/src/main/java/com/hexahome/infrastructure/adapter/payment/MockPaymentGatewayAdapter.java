package com.hexahome.infrastructure.adapter.payment;

import com.hexahome.application.port.out.OrderResult;
import com.hexahome.application.port.out.PaymentGatewayPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Mock / Development Payment Gateway Adapter.
 * Onion Architecture Outbound Adapter: decouple core billing logic from third-party payment providers.
 * Real payment gateways (e.g., Razorpay, Stripe) can be activated later by implementing PaymentGatewayPort.
 */
@Component
public class MockPaymentGatewayAdapter implements PaymentGatewayPort {

    private static final Logger log = LoggerFactory.getLogger(MockPaymentGatewayAdapter.class);

    @Override
    public OrderResult createOrder(String orderId, BigDecimal amount, String currency) {
        log.info("[MOCK PAYMENT ADAPTER] Order created: id={}, amount={}, currency={}", orderId, amount, currency);
        return new OrderResult(
                orderId,
                amount,
                currency != null ? currency : "INR",
                getGatewayName(),
                "mock_payment_key"
        );
    }

    @Override
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        log.info("[MOCK PAYMENT ADAPTER] Verifying simulated payment: orderId={}, paymentId={}", orderId, paymentId);
        return orderId != null && !orderId.isBlank() && paymentId != null && !paymentId.isBlank();
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        log.info("[MOCK PAYMENT ADAPTER] Verifying simulated webhook signature: {}", signature);
        return signature != null && !signature.isBlank();
    }

    @Override
    public String getGatewayName() {
        return "MOCK";
    }
}
