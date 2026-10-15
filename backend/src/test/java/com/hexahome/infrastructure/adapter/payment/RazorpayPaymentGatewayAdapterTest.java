package com.hexahome.infrastructure.adapter.payment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Razorpay Payment Gateway Adapter Unit Tests")
class RazorpayPaymentGatewayAdapterTest {

    private RazorpayPaymentGatewayAdapter adapter;
    private final String keyId = "rzp_test_Tnhdqxkz85pAVO";
    private final String keySecret = "I7gB5W1CHl358SPjZyA3SMVp";
    private final String webhookSecret = "hexahome_rzp_webhook_secret_2025";

    @BeforeEach
    void setUp() {
        adapter = new RazorpayPaymentGatewayAdapter(keyId, keySecret, webhookSecret);
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    @Test
    @DisplayName("verifySignature returns true when HMAC-SHA256 matches")
    void testVerifySignature_Valid() throws Exception {
        String orderId = "order_O4uFzL2lWj3vB8";
        String paymentId = "pay_O4uG9x1lK2mN3P";
        String validSignature = calculateHmacSha256(orderId + "|" + paymentId, keySecret);

        boolean result = adapter.verifySignature(orderId, paymentId, validSignature);

        assertTrue(result, "Cryptographic signature verification should succeed for valid HMAC-SHA256");
    }

    @Test
    @DisplayName("verifySignature returns false when signature is forged or tampered")
    void testVerifySignature_Invalid() {
        String orderId = "order_O4uFzL2lWj3vB8";
        String paymentId = "pay_O4uG9x1lK2mN3P";
        String forgedSignature = "d41d8cd98f00b204e9800998ecf8427e99999999999999999999999999999999";

        boolean result = adapter.verifySignature(orderId, paymentId, forgedSignature);

        assertFalse(result, "Signature verification must fail for forged signature");
    }

    @Test
    @DisplayName("verifySignature returns false when inputs are null or empty")
    void testVerifySignature_NullInputs() {
        assertFalse(adapter.verifySignature(null, "pay_123", "sig_123"));
        assertFalse(adapter.verifySignature("order_123", null, "sig_123"));
        assertFalse(adapter.verifySignature("order_123", "pay_123", null));
    }

    @Test
    @DisplayName("verifyWebhookSignature returns true when webhook signature matches")
    void testVerifyWebhookSignature_Valid() throws Exception {
        String payload = "{\"entity\":\"event\",\"event\":\"payment.captured\"}";
        String validSignature = calculateHmacSha256(payload, webhookSecret);

        boolean result = adapter.verifyWebhookSignature(payload, validSignature);

        assertTrue(result, "Webhook signature verification should succeed for authentic Razorpay event");
    }

    @Test
    @DisplayName("verifyWebhookSignature returns false when webhook payload is tampered")
    void testVerifyWebhookSignature_Invalid() {
        String payload = "{\"entity\":\"event\",\"event\":\"payment.captured\"}";
        String forgedSignature = "invalid_webhook_signature_string";

        boolean result = adapter.verifyWebhookSignature(payload, forgedSignature);

        assertFalse(result, "Webhook verification must fail for invalid signature");
    }

    @Test
    @DisplayName("verifyWebhookSignature returns false for null inputs")
    void testVerifyWebhookSignature_NullInputs() {
        assertFalse(adapter.verifyWebhookSignature(null, "sig_123"));
        assertFalse(adapter.verifyWebhookSignature("{}", null));
    }

    @Test
    @DisplayName("getGatewayName returns RAZORPAY")
    void testGetGatewayName() {
        assertEquals("RAZORPAY", adapter.getGatewayName());
    }
}
