package com.hexahome.application.dto.engagement;

import java.util.UUID;

public class WishlistStatusDto {

    private UUID propertyId;
    private boolean bookmarked;
    private long totalSaves;
    private String message;

    public WishlistStatusDto() {
    }

    public WishlistStatusDto(UUID propertyId, boolean bookmarked, long totalSaves, String message) {
        this.propertyId = propertyId;
        this.bookmarked = bookmarked;
        this.totalSaves = totalSaves;
        this.message = message;
    }

    public UUID getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(UUID propertyId) {
        this.propertyId = propertyId;
    }

    public boolean isBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        this.bookmarked = bookmarked;
    }

    public long getTotalSaves() {
        return totalSaves;
    }

    public void setTotalSaves(long totalSaves) {
        this.totalSaves = totalSaves;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
