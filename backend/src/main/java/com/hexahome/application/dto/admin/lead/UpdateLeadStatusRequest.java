package com.hexahome.application.dto.admin.lead;

import jakarta.validation.constraints.NotBlank;

public class UpdateLeadStatusRequest {

    @NotBlank(message = "Target status is required")
    private String status;

    private String reason;

    public UpdateLeadStatusRequest() {
    }

    public UpdateLeadStatusRequest(String status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
