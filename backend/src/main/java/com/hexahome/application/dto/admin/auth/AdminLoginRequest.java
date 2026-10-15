package com.hexahome.application.dto.admin.auth;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginRequest {

    @NotBlank(message = "Username or email is required")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;

    public AdminLoginRequest() {
    }

    public AdminLoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getUsername() {
        return usernameOrEmail;
    }

    public void setUsername(String username) {
        if (this.usernameOrEmail == null || this.usernameOrEmail.isBlank()) {
            this.usernameOrEmail = username;
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
