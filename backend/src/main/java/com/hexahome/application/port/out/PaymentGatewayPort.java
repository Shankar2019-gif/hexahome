package com.hexahome.application.port.out;

import java.math.BigDecimal;

public interface PaymentGatewayPort {

    OrderResult createOrder(String orderId, BigDecimal amount, String currency);

    boolean verifySignature(String orderId, String paymentId, String signature);

    boolean verifyWebhookSignature(String payload, String signature);

    String getGatewayName();
}
