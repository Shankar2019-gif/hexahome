package com.hexahome.application.dto.billing;

import java.math.BigDecimal;

public class CreateOrderRequest {

    private String planId;
    private BigDecimal amount;
    private String currency = "INR";
    private String gateway = "RAZORPAY";

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String planId) {
        this.planId = planId;
    }

    public CreateOrderRequest(String planId, BigDecimal amount, String currency) {
        this.planId = planId;
        this.amount = amount;
        this.currency = currency;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency != null ? currency : "INR";
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getGateway() {
        return gateway != null ? gateway : "RAZORPAY";
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }
}
