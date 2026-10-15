package com.hexahome.application.dto.admin.moderation;

import com.hexahome.application.dto.meta.AmenityDto;
import com.hexahome.application.dto.property.PropertyImageDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class AdminPropertyDetailDto {

    private UUID id;
    private String shortId;
    private String slug;
    private String title;
    private String description;
    private String adType;
    private String propertyType;

    private BigDecimal price;
    private BigDecimal deposit;
    private BigDecimal maintenanceCharges;
    private boolean isMaintenanceIncluded;

    private String bhk;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;
    private BigDecimal builtUpArea;
    private BigDecimal carpetArea;

    private String furnishing;
    private String preferredTenant;
    private String facing;
    private Integer floorNumber;
    private Integer totalFloors;

    private LocalDate availableFrom;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;

    private String status;
    private boolean isVerified;
    private boolean isZeroBrokerage;
    private boolean isHotDeal;

    private Integer cityId;
    private String cityName;
    private Integer localityId;
    private String localityName;

    private UUID ownerId;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    private List<PropertyImageDto> images;
    private List<AmenityDto> amenities;

    private Instant createdAt;
    private Instant updatedAt;

    public AdminPropertyDetailDto() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getBalconies() {
        return balconies;
    }

    public void setBalconies(Integer balconies) {
        this.balconies = balconies;
    }

    public BigDecimal getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(BigDecimal builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public BigDecimal getCarpetArea() {
        return carpetArea;
    }

    public void setCarpetArea(BigDecimal carpetArea) {
        this.carpetArea = carpetArea;
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

    public String getFacing() {
        return facing;
    }

    public void setFacing(String facing) {
        this.facing = facing;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(Integer totalFloors) {
        this.totalFloors = totalFloors;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDate availableFrom) {
        this.availableFrom = availableFrom;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Integer getLocalityId() {
        return localityId;
    }

    public void setLocalityId(Integer localityId) {
        this.localityId = localityId;
    }

    public String getLocalityName() {
        return localityName;
    }

    public void setLocalityName(String localityName) {
        this.localityName = localityName;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
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

    public List<PropertyImageDto> getImages() {
        return images;
    }

    public void setImages(List<PropertyImageDto> images) {
        this.images = images;
    }

    public List<AmenityDto> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<AmenityDto> amenities) {
        this.amenities = amenities;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
