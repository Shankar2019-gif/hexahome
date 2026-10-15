package com.hexahome.application.dto.lead;

import com.hexahome.persistence.entity.Lead;

import java.time.Instant;
import java.util.UUID;

public class LeadResponseDto {

    private UUID id;
    private UUID propertyId;
    private String propertyTitle;
    private String propertySlug;
    private UUID seekerId;
    private String seekerName;
    private String seekerPhone;
    private String message;
    private String status;
    private Instant createdAt;

    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    private java.math.BigDecimal propertyPrice;
    private String propertyBhk;
    private String propertyLocation;

    public LeadResponseDto() {
    }

    public static LeadResponseDto fromEntity(Lead lead) {
        if (lead == null) return null;

        LeadResponseDto dto = new LeadResponseDto();
        dto.setId(lead.getId());
        if (lead.getProperty() != null) {
            dto.setPropertyId(lead.getProperty().getId());
            dto.setPropertyTitle(lead.getProperty().getTitle());
            dto.setPropertySlug(lead.getProperty().getSlug());
            dto.setPropertyPrice(lead.getProperty().getPrice());
            dto.setPropertyBhk(lead.getProperty().getBhk());
            String loc = "";
            if (lead.getProperty().getLocality() != null) {
                loc = lead.getProperty().getLocality().getName();
            }
            if (lead.getProperty().getCity() != null) {
                loc = loc.isEmpty() ? lead.getProperty().getCity().getName() : loc + ", " + lead.getProperty().getCity().getName();
            }
            dto.setPropertyLocation(loc);

            if (lead.getProperty().getOwner() != null) {
                dto.setOwnerName(lead.getProperty().getOwner().getName());
                dto.setOwnerPhone(lead.getProperty().getOwner().getPhone());
                dto.setOwnerEmail(lead.getProperty().getOwner().getEmail());
            }
        }
        if (lead.getSeeker() != null) {
            dto.setSeekerId(lead.getSeeker().getId());
        }
        dto.setSeekerName(lead.getSeekerName());
        dto.setSeekerPhone(lead.getSeekerPhone());
        dto.setMessage(lead.getMessage());
        dto.setStatus(lead.getStatus());
        dto.setCreatedAt(lead.getCreatedAt());

        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(UUID propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getPropertySlug() {
        return propertySlug;
    }

    public void setPropertySlug(String propertySlug) {
        this.propertySlug = propertySlug;
    }

    public UUID getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(UUID seekerId) {
        this.seekerId = seekerId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerPhone() {
        return ownerPhone;
    }

    public void setOwnerPhone(String ownerPhone) {
        this.ownerPhone = ownerPhone;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public java.math.BigDecimal getPropertyPrice() {
        return propertyPrice;
    }

    public void setPropertyPrice(java.math.BigDecimal propertyPrice) {
        this.propertyPrice = propertyPrice;
    }

    public String getPropertyBhk() {
        return propertyBhk;
    }

    public void setPropertyBhk(String propertyBhk) {
        this.propertyBhk = propertyBhk;
    }

    public String getPropertyLocation() {
        return propertyLocation;
    }

    public void setPropertyLocation(String propertyLocation) {
        this.propertyLocation = propertyLocation;
    }
}
