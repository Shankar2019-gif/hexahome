package com.hexahome.application.dto.property;

import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.PropertyImage;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PropertySummaryDto {

    private UUID id;
    private String shortId;
    private String slug;
    private String title;
    private String adType;
    private String propertyType;
    private BigDecimal price;
    private BigDecimal deposit;
    private BigDecimal maintenanceCharges;
    private boolean isMaintenanceIncluded;
    private String bhk;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal builtUpArea;
    private String furnishing;
    private String preferredTenant;
    private String cityName;
    private String citySlug;
    private String localityName;
    private String localitySlug;
    private String address;
    private String coverImageUrl;
    private boolean isVerified;
    private boolean isZeroBrokerage;
    private boolean isHotDeal;
    private String status;
    private Instant createdAt;

    public PropertySummaryDto() {
    }

    public static PropertySummaryDto fromEntity(Property property) {
        if (property == null) return null;

        PropertySummaryDto dto = new PropertySummaryDto();
        dto.setId(property.getId());
        dto.setShortId(property.getShortId());
        dto.setSlug(property.getSlug());
        dto.setTitle(property.getTitle());
        dto.setAdType(property.getAdType());
        dto.setPropertyType(property.getPropertyType());
        dto.setPrice(property.getPrice());
        dto.setDeposit(property.getDeposit());
        dto.setMaintenanceCharges(property.getMaintenanceCharges());
        dto.setMaintenanceIncluded(property.isMaintenanceIncluded());
        dto.setBhk(property.getBhk());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setBuiltUpArea(property.getBuiltUpArea());
        dto.setFurnishing(property.getFurnishing());
        dto.setPreferredTenant(property.getPreferredTenant());

        if (property.getCity() != null) {
            dto.setCityName(property.getCity().getName());
            dto.setCitySlug(property.getCity().getSlug());
        }
        if (property.getLocality() != null) {
            dto.setLocalityName(property.getLocality().getName());
            dto.setLocalitySlug(property.getLocality().getSlug());
        }

        dto.setAddress(property.getAddress());
        dto.setVerified(property.isVerified());
        dto.setZeroBrokerage(property.isZeroBrokerage());
        dto.setHotDeal(property.isHotDeal());
        dto.setStatus(property.getStatus());
        dto.setCreatedAt(property.getCreatedAt());

        // Cover image detection
        if (property.getImages() != null && !property.getImages().isEmpty()) {
            String coverUrl = property.getImages().stream()
                    .filter(PropertyImage::isCover)
                    .map(PropertyImage::getImageUrl)
                    .findFirst()
                    .orElse(property.getImages().get(0).getImageUrl());
            dto.setCoverImageUrl(coverUrl);
        }

        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getShortId() {
        return shortId;
    }

    public void setShortId(String shortId) {
        this.shortId = shortId;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAdType() {
        return adType;
    }

    public void setAdType(String adType) {
        this.adType = adType;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public BigDecimal getMaintenanceCharges() {
        return maintenanceCharges;
    }

    public void setMaintenanceCharges(BigDecimal maintenanceCharges) {
        this.maintenanceCharges = maintenanceCharges;
    }

    public boolean isMaintenanceIncluded() {
        return isMaintenanceIncluded;
    }

    public void setMaintenanceIncluded(boolean maintenanceIncluded) {
        isMaintenanceIncluded = maintenanceIncluded;
    }

    public String getBhk() {
        return bhk;
    }

    public void setBhk(String bhk) {
        this.bhk = bhk;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public BigDecimal getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(BigDecimal builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public String getFurnishing() {
        return furnishing;
    }

    public void setFurnishing(String furnishing) {
        this.furnishing = furnishing;
    }

    public String getPreferredTenant() {
        return preferredTenant;
    }

    public void setPreferredTenant(String preferredTenant) {
        this.preferredTenant = preferredTenant;
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

    public String getLocalityName() {
        return localityName;
    }

    public void setLocalityName(String localityName) {
        this.localityName = localityName;
    }

    public String getLocalitySlug() {
        return localitySlug;
    }

    public void setLocalitySlug(String localitySlug) {
        this.localitySlug = localitySlug;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public boolean isZeroBrokerage() {
        return isZeroBrokerage;
    }

    public void setZeroBrokerage(boolean zeroBrokerage) {
        isZeroBrokerage = zeroBrokerage;
    }

    public boolean isHotDeal() {
        return isHotDeal;
    }

    public void setHotDeal(boolean hotDeal) {
        isHotDeal = hotDeal;
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
}
