package com.hexahome.application.dto.billing;

import com.hexahome.persistence.entity.Payment;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PaymentHistoryDto {

    private UUID id;
    private String orderId;
    private String paymentId;
    private String gateway;
    private BigDecimal amountInr;
    private String status;
    private String planName;
    private Instant createdAt;

    public PaymentHistoryDto() {
    }

    public PaymentHistoryDto(UUID id, String orderId, String paymentId, String gateway, BigDecimal amountInr, String status, String planName, Instant createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.gateway = gateway;
        this.amountInr = amountInr;
        this.status = status;
        this.planName = planName;
        this.createdAt = createdAt;
    }

    public static PaymentHistoryDto fromEntity(Payment payment) {
        if (payment == null) return null;
        String planName = null;
        if (payment.getSubscription() != null && payment.getSubscription().getPlan() != null) {
            planName = payment.getSubscription().getPlan().getName();
        }
        return new PaymentHistoryDto(
                payment.getId(),
                payment.getOrderId(),
                payment.getPaymentId(),
                payment.getGateway(),
                payment.getAmountInr(),
                payment.getStatus(),
                planName,
                payment.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getGateway() {
        return gateway;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }

    public BigDecimal getAmountInr() {
        return amountInr;
    }

    public void setAmountInr(BigDecimal amountInr) {
        this.amountInr = amountInr;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
