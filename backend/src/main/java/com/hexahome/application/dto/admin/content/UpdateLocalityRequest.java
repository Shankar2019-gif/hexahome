package com.hexahome.application.dto.admin.content;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class UpdateLocalityRequest {

    private Integer cityId;

    @NotBlank(message = "Locality name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer pinCode;
    private Integer displayOrder;

    public UpdateLocalityRequest() {
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getPinCode() {
        return pinCode;
    }

    public void setPinCode(Integer pinCode) {
        this.pinCode = pinCode;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
