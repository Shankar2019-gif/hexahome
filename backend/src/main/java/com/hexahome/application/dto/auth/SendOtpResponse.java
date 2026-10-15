package com.hexahome.application.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendOtpResponse {

    private String phone;
    private int expiresInSeconds;
    private String message;
    public SendOtpResponse() {
    }

    public SendOtpResponse(String phone, int expiresInSeconds, String message) {
        this.phone = phone;
        this.expiresInSeconds = expiresInSeconds;
        this.message = message;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(int expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
