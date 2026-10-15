package com.hexahome.application.dto.admin.moderation;

import jakarta.validation.constraints.NotBlank;

public class RejectListingRequest {

    @NotBlank(message = "Rejection reason is mandatory")
    private String reason;

    public RejectListingRequest() {
    }

    public RejectListingRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
