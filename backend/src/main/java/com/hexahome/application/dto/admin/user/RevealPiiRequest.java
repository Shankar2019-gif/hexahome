package com.hexahome.application.dto.admin.user;

import jakarta.validation.constraints.NotBlank;

public class RevealPiiRequest {

    @NotBlank(message = "Audit reason is required to reveal customer PII")
    private String reason;

    public RevealPiiRequest() {
    }

    public RevealPiiRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
