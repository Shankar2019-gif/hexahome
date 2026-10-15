package com.hexahome.application.dto.admin.auth;

public class AdminRefreshTokenRequest {

    private String refreshToken;

    public AdminRefreshTokenRequest() {
    }

    public AdminRefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
