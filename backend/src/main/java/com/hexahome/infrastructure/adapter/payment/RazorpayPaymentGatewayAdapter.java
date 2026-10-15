package com.hexahome.infrastructure.adapter.payment;

import com.hexahome.application.port.out.OrderResult;
import com.hexahome.application.port.out.PaymentGatewayPort;
import com.hexahome.domain.exception.BadRequestException;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

/**
 * Production-ready Razorpay Payment Gateway Adapter.
 * Integrates with official Razorpay Java SDK for order creation,
 * cryptographic HMAC-SHA256 signature verification, and webhook handling.
 */
@Component
@Primary
public class RazorpayPaymentGatewayAdapter implements PaymentGatewayPort {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentGatewayAdapter.class);

    private final RazorpayClient razorpayClient;
    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;

    @Autowired
    public RazorpayPaymentGatewayAdapter(
            @Value("${razorpay.key-id:${hexahome.razorpay.key-id:rzp_test_Tnhdqxkz85pAVO}}") String keyId,
            @Value("${razorpay.key-secret:${hexahome.razorpay.key-secret:I7gB5W1CHl358SPjZyA3SMVp}}") String keySecret,
            @Value("${razorpay.webhook-secret:${hexahome.razorpay.webhook-secret:hexahome_rzp_webhook_secret_2025}}") String webhookSecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;

        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
            log.info("RazorpayClient successfully initialized with Key ID: {}", keyId);
        } catch (RazorpayException e) {
            log.error("Failed to initialize RazorpayClient: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to initialize RazorpayClient", e);
        }
    }

    // Constructor for testing / mocking
    public RazorpayPaymentGatewayAdapter(
            RazorpayClient razorpayClient,
            String keyId,
            String keySecret,
            String webhookSecret) {
        this.razorpayClient = razorpayClient;
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;
    }

    @Override
    public OrderResult createOrder(String receipt, BigDecimal amount, String currency) {
        try {
            long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency != null && !currency.isBlank() ? currency.toUpperCase() : "INR");
            orderRequest.put("receipt", receipt != null ? receipt : "rcpt_" + System.currentTimeMillis());

            log.info("Creating Razorpay order: amount={} paise, receipt={}, currency={}", amountInPaise, receipt, currency);
            Order order = razorpayClient.orders.create(orderRequest);

            String razorpayOrderId = order.get("id");
            log.info("Razorpay order created successfully: id={}", razorpayOrderId);

            return new OrderResult(
                    razorpayOrderId,
                    amount,
                    currency != null ? currency : "INR",
                    getGatewayName(),
                    keyId
            );
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order: {}", e.getMessage(), e);
            throw new BadRequestException("Razorpay order creation failed: " + e.getMessage());
        }
    }

    @Override
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null) {
            return false;
        }
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId.trim());
            attributes.put("razorpay_payment_id", paymentId.trim());
            attributes.put("razorpay_signature", signature.trim());

            return Utils.verifyPaymentSignature(attributes, keySecret);
        } catch (Exception e) {
            log.warn("Utils.verifyPaymentSignature threw exception: {}. Performing manual HMAC-SHA256 verification.", e.getMessage());
            return verifyHmacSha256(orderId.trim() + "|" + paymentId.trim(), signature.trim(), keySecret);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        if (payload == null || signature == null || webhookSecret == null) {
            return false;
        }
        try {
            return Utils.verifyWebhookSignature(payload, signature.trim(), webhookSecret.trim());
        } catch (Exception e) {
            log.warn("Utils.verifyWebhookSignature threw exception: {}. Performing manual HMAC-SHA256 verification.", e.getMessage());
            return verifyHmacSha256(payload, signature.trim(), webhookSecret);
        }
    }

    @Override
    public String getGatewayName() {
        return "RAZORPAY";
    }

    private boolean verifyHmacSha256(String data, String expectedSignature, String secret) {
        try {
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
            return hexString.toString().equalsIgnoreCase(expectedSignature.trim());
        } catch (Exception ex) {
            log.error("Manual HMAC-SHA256 verification error: {}", ex.getMessage());
            return false;
        }
    }
}
