package com.hexahome.application.dto.admin.user;

import jakarta.validation.constraints.NotBlank;

public class UserBlockActionRequest {

    @NotBlank(message = "Action reason is mandatory")
    private String reason;

    public UserBlockActionRequest() {
    }

    public UserBlockActionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
