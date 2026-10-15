package com.hexahome.application.dto.location;

import com.hexahome.persistence.entity.Locality;

import java.math.BigDecimal;

public class LocalityDto {

    private Integer id;
    private Integer cityId;
    private String cityName;
    private String citySlug;
    private String name;
    private String slug;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer pinCode;
    private Integer displayOrder;
    private long propertyCount;

    public LocalityDto() {
    }

    public LocalityDto(Integer id, Integer cityId, String cityName, String citySlug, String name, String slug, BigDecimal latitude, BigDecimal longitude, Integer pinCode, Integer displayOrder, long propertyCount) {
        this.id = id;
        this.cityId = cityId;
        this.cityName = cityName;
        this.citySlug = citySlug;
        this.name = name;
        this.slug = slug;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pinCode = pinCode;
        this.displayOrder = displayOrder;
        this.propertyCount = propertyCount;
    }

    public static LocalityDto fromEntity(Locality locality, long propertyCount) {
        if (locality == null) return null;
        return new LocalityDto(
                locality.getId(),
                locality.getCity() != null ? locality.getCity().getId() : null,
                locality.getCity() != null ? locality.getCity().getName() : null,
                locality.getCity() != null ? locality.getCity().getSlug() : null,
                locality.getName(),
                locality.getSlug(),
                locality.getLatitude(),
                locality.getLongitude(),
                locality.getPinCode(),
                locality.getDisplayOrder(),
                propertyCount
        );
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

    public String getCitySlug() {
        return citySlug;
    }

    public void setCitySlug(String citySlug) {
        this.citySlug = citySlug;
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

    public long getPropertyCount() {
        return propertyCount;
    }

    public void setPropertyCount(long propertyCount) {
        this.propertyCount = propertyCount;
    }
}
