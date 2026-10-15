package com.hexahome.application.dto.billing;

import java.math.BigDecimal;

public class OrderResponseDto {

    private String orderId;
    private BigDecimal amountInr;
    private String currency;
    private String gateway;
    private String keyId;
    private PlanDto plan;

    public OrderResponseDto() {
    }

    public OrderResponseDto(String orderId, BigDecimal amountInr, String currency, String gateway, String keyId, PlanDto plan) {
        this.orderId = orderId;
        this.amountInr = amountInr;
        this.currency = currency;
        this.gateway = gateway;
        this.keyId = keyId;
        this.plan = plan;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmountInr() {
        return amountInr;
    }

    public void setAmountInr(BigDecimal amountInr) {
        this.amountInr = amountInr;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getGateway() {
        return gateway;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public PlanDto getPlan() {
        return plan;
    }

    public void setPlan(PlanDto plan) {
        this.plan = plan;
    }
}
