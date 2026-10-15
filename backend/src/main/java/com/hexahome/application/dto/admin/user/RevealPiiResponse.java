package com.hexahome.application.dto.admin.user;

import java.util.UUID;

public class RevealPiiResponse {

    private UUID userId;
    private String phone;
    private String email;

    public RevealPiiResponse() {
    }

    public RevealPiiResponse(UUID userId, String phone, String email) {
        this.userId = userId;
        this.phone = phone;
        this.email = email;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
