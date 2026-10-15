package com.hexahome.application.dto.admin.billing;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ManualGrantCreditsRequest {

    @Min(value = 1, message = "Credits to add must be at least 1")
    @Max(value = 500, message = "Credits cannot exceed 500 in a single grant")
    private int creditsToAdd;

    @NotBlank(message = "Audit reason is required for manual credit adjustments")
    private String reason;

    public ManualGrantCreditsRequest() {
    }

    public ManualGrantCreditsRequest(int creditsToAdd, String reason) {
        this.creditsToAdd = creditsToAdd;
        this.reason = reason;
    }

    public int getCreditsToAdd() {
        return creditsToAdd;
    }

    public void setCreditsToAdd(int creditsToAdd) {
        this.creditsToAdd = creditsToAdd;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
