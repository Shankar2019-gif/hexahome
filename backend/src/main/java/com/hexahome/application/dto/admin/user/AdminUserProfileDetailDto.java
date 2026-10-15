package com.hexahome.application.dto.admin.user;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class AdminUserProfileDetailDto {

    private UUID id;
    private String name;
    private String firstName;
    private String lastName;
    private String maskedPhone;
    private String maskedEmail;
    private String profilePicUrl;
    private Set<String> roles;
    private boolean isActive;
    private boolean isVerified;
    private long totalPropertiesListed;
    private long totalLeadsSubmitted;
    private Instant createdAt;
    private Instant updatedAt;

    public AdminUserProfileDetailDto() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMaskedPhone() {
        return maskedPhone;
    }

    public void setMaskedPhone(String maskedPhone) {
        this.maskedPhone = maskedPhone;
    }

    public String getMaskedEmail() {
        return maskedEmail;
    }

    public void setMaskedEmail(String maskedEmail) {
        this.maskedEmail = maskedEmail;
    }

    public String getProfilePicUrl() {
        return profilePicUrl;
    }

    public void setProfilePicUrl(String profilePicUrl) {
        this.profilePicUrl = profilePicUrl;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public long getTotalPropertiesListed() {
        return totalPropertiesListed;
    }

    public void setTotalPropertiesListed(long totalPropertiesListed) {
        this.totalPropertiesListed = totalPropertiesListed;
    }

    public long getTotalLeadsSubmitted() {
        return totalLeadsSubmitted;
    }

    public void setTotalLeadsSubmitted(long totalLeadsSubmitted) {
        this.totalLeadsSubmitted = totalLeadsSubmitted;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
