package com.hexahome.application.dto.billing;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VerifyPaymentRequest {

    private String orderId;

    @JsonProperty("razorpay_order_id")
    private String razorpayOrderId;

    private String paymentId;

    @JsonProperty("razorpay_payment_id")
    private String razorpayPaymentId;

    private String signature;

    @JsonProperty("razorpay_signature")
    private String razorpaySignature;

    public VerifyPaymentRequest() {
    }

    public VerifyPaymentRequest(String orderId, String paymentId, String signature) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
    }

    public String getEffectiveOrderId() {
        if (razorpayOrderId != null && !razorpayOrderId.isBlank()) {
            return razorpayOrderId;
        }
        return orderId;
    }

    public String getEffectivePaymentId() {
        if (razorpayPaymentId != null && !razorpayPaymentId.isBlank()) {
            return razorpayPaymentId;
        }
        return paymentId;
    }

    public String getEffectiveSignature() {
        if (razorpaySignature != null && !razorpaySignature.isBlank()) {
            return razorpaySignature;
        }
        return signature;
    }

    public String getOrderId() {
        return getEffectiveOrderId();
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getPaymentId() {
        return getEffectivePaymentId();
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getSignature() {
        return getEffectiveSignature();
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}
