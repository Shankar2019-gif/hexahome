package com.hexahome.application.dto.admin.system;

import jakarta.validation.constraints.Size;

public class UpdateAdminUserRequest {

    private String fullName;
    private String role;
    private Boolean isActive;

    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;

    public UpdateAdminUserRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
