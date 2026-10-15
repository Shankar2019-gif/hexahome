package com.hexahome.application.dto.admin.content;

import java.math.BigDecimal;

public class AdminCityDto {

    private Integer id;
    private String name;
    private String state;
    private String slug;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer displayOrder;
    private boolean isActive;

    public AdminCityDto() {
    }

    public AdminCityDto(Integer id, String name, String state, String slug, BigDecimal latitude, BigDecimal longitude, Integer displayOrder, boolean isActive) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.slug = slug;
        this.latitude = latitude;
        this.longitude = longitude;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
