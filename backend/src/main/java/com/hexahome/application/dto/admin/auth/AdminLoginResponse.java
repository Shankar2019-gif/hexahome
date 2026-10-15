package com.hexahome.application.dto.admin.auth;

public class AdminLoginResponse {

    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private AdminUserSummaryDto user;

    public AdminLoginResponse() {
    }

    public AdminLoginResponse(String accessToken, String refreshToken, long expiresIn, AdminUserSummaryDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public AdminUserSummaryDto getUser() {
        return user;
    }

    public void setUser(AdminUserSummaryDto user) {
        this.user = user;
    }
}
