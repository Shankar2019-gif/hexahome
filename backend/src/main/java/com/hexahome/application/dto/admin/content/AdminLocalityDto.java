package com.hexahome.application.dto.admin.content;

import java.math.BigDecimal;

public class AdminLocalityDto {

    private Integer id;
    private Integer cityId;
    private String cityName;
    private String name;
    private String slug;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer pinCode;
    private Integer displayOrder;

    public AdminLocalityDto() {
    }

    public AdminLocalityDto(Integer id, Integer cityId, String cityName, String name, String slug, BigDecimal latitude, BigDecimal longitude, Integer pinCode, Integer displayOrder) {
        this.id = id;
        this.cityId = cityId;
        this.cityName = cityName;
        this.name = name;
        this.slug = slug;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pinCode = pinCode;
        this.displayOrder = displayOrder;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
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
