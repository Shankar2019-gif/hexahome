package com.hexahome.application.dto.admin.content;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class UpdateCityRequest {

    @NotBlank(message = "City name is required")
    private String name;

    @NotBlank(message = "State name is required")
    private String state;

    @NotBlank(message = "Slug is required")
    private String slug;

    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer displayOrder;
    private Boolean isActive;

    public UpdateCityRequest() {
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
