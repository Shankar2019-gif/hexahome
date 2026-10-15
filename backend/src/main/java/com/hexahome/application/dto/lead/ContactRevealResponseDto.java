package com.hexahome.application.dto.lead;

import java.time.Instant;
import java.util.UUID;

public class ContactRevealResponseDto {

    private UUID propertyId;
    private String propertyTitle;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    private boolean alreadyRevealed;
    private int creditDeducted;
    private int remainingCredits;
    private Instant viewedAt;

    public ContactRevealResponseDto() {
    }

    public ContactRevealResponseDto(UUID propertyId, String propertyTitle, String ownerName, String ownerPhone, boolean alreadyRevealed, int creditDeducted, int remainingCredits, Instant viewedAt) {
        this(propertyId, propertyTitle, ownerName, ownerPhone, null, alreadyRevealed, creditDeducted, remainingCredits, viewedAt);
    }

    public ContactRevealResponseDto(UUID propertyId, String propertyTitle, String ownerName, String ownerPhone, String ownerEmail, boolean alreadyRevealed, int creditDeducted, int remainingCredits, Instant viewedAt) {
        this.propertyId = propertyId;
        this.propertyTitle = propertyTitle;
        this.ownerName = ownerName;
        this.ownerPhone = ownerPhone;
        this.ownerEmail = ownerEmail;
        this.alreadyRevealed = alreadyRevealed;
        this.creditDeducted = creditDeducted;
        this.remainingCredits = remainingCredits;
        this.viewedAt = viewedAt;
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

    public boolean isAlreadyRevealed() {
        return alreadyRevealed;
    }

    public void setAlreadyRevealed(boolean alreadyRevealed) {
        this.alreadyRevealed = alreadyRevealed;
    }

    public int getCreditDeducted() {
        return creditDeducted;
    }

    public void setCreditDeducted(int creditDeducted) {
        this.creditDeducted = creditDeducted;
    }

    public int getRemainingCredits() {
        return remainingCredits;
    }

    public void setRemainingCredits(int remainingCredits) {
        this.remainingCredits = remainingCredits;
    }

    public Instant getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(Instant viewedAt) {
        this.viewedAt = viewedAt;
    }
}
