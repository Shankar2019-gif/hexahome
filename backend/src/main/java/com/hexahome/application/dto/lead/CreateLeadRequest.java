package com.hexahome.application.dto.lead;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public class CreateLeadRequest {

    @NotNull(message = "Property ID is required")
    private UUID propertyId;

    @NotBlank(message = "Seeker name is required")
    private String seekerName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian mobile number")
    private String seekerPhone;

    private String message;

    public CreateLeadRequest() {
    }

    public CreateLeadRequest(UUID propertyId, String seekerName, String seekerPhone, String message) {
        this.propertyId = propertyId;
        this.seekerName = seekerName;
        this.seekerPhone = seekerPhone;
        this.message = message;
    }

    public UUID getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(UUID propertyId) {
        this.propertyId = propertyId;
    }

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getSeekerPhone() {
        return seekerPhone;
    }

    public void setSeekerPhone(String seekerPhone) {
        this.seekerPhone = seekerPhone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
