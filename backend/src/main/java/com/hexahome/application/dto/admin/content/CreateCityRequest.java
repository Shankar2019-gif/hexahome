package com.hexahome.application.dto.admin.content;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CreateCityRequest {

    @NotBlank(message = "City name is required")
    private String name;

    @NotBlank(message = "State name is required")
    private String state;

    @NotBlank(message = "Slug is required")
    private String slug;

    private BigDecimal latitude = BigDecimal.ZERO;
    private BigDecimal longitude = BigDecimal.ZERO;
    private Integer displayOrder = 0;
    private boolean isActive = true;

    public CreateCityRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
