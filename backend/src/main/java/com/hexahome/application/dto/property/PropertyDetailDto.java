package com.hexahome.application.dto.property;

import com.hexahome.application.dto.meta.AmenityDto;
import com.hexahome.persistence.entity.Property;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class PropertyDetailDto {

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

    private String cityName;
    private String citySlug;
    private String localityName;
    private String localitySlug;

    private UUID ownerId;
    private String ownerName;
    private String ownerPhoneMasked;
    private String ownerEmailMasked;

    private boolean isVerified;
    private boolean isZeroBrokerage;
    private boolean isHotDeal;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    private List<PropertyImageDto> images = new ArrayList<>();
    private List<AmenityDto> amenities = new ArrayList<>();

    private PgDetailDto pgDetail;
    private CommercialDetailDto commercialDetail;
    private PlotDetailDto plotDetail;

    public PropertyDetailDto() {
    }

    public static PropertyDetailDto fromEntity(Property property) {
        if (property == null) return null;

        PropertyDetailDto dto = new PropertyDetailDto();
        dto.setId(property.getId());
        dto.setShortId(property.getShortId());
        dto.setSlug(property.getSlug());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setAdType(property.getAdType());
        dto.setPropertyType(property.getPropertyType());
        dto.setPrice(property.getPrice());
        dto.setDeposit(property.getDeposit());
        dto.setMaintenanceCharges(property.getMaintenanceCharges());
        dto.setMaintenanceIncluded(property.isMaintenanceIncluded());
        dto.setBhk(property.getBhk());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setBalconies(property.getBalconies());
        dto.setBuiltUpArea(property.getBuiltUpArea());
        dto.setCarpetArea(property.getCarpetArea());
        dto.setFurnishing(property.getFurnishing());
        dto.setPreferredTenant(property.getPreferredTenant());
        dto.setFacing(property.getFacing());
        dto.setFloorNumber(property.getFloorNumber());
        dto.setTotalFloors(property.getTotalFloors());
        dto.setAvailableFrom(property.getAvailableFrom());
        dto.setLatitude(property.getLatitude());
        dto.setLongitude(property.getLongitude());
        dto.setAddress(property.getAddress());

        if (property.getCity() != null) {
            dto.setCityName(property.getCity().getName());
            dto.setCitySlug(property.getCity().getSlug());
        }
        if (property.getLocality() != null) {
            dto.setLocalityName(property.getLocality().getName());
            dto.setLocalitySlug(property.getLocality().getSlug());
        }

        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
            dto.setOwnerName(property.getOwner().getName());
            String phone = property.getOwner().getPhone();
            if (phone != null && !phone.isBlank()) {
                dto.setOwnerPhoneMasked(phone.length() >= 5
                        ? phone.substring(0, 5) + "XXXXX"
                        : "XXXXX");
            }
            String email = property.getOwner().getEmail();
            if (email != null && !email.isBlank()) {
                int at = email.indexOf('@');
                if (at > 2) {
                    dto.setOwnerEmailMasked(email.substring(0, 2) + "***@" + email.substring(at + 1));
                } else if (at > 0) {
                    dto.setOwnerEmailMasked(email.substring(0, 1) + "***@" + email.substring(at + 1));
                } else {
                    dto.setOwnerEmailMasked("***@hexahome.in");
                }
            }
        }

        dto.setVerified(property.isVerified());
        dto.setZeroBrokerage(property.isZeroBrokerage());
        dto.setHotDeal(property.isHotDeal());
        dto.setStatus(property.getStatus());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());

        if (property.getImages() != null) {
            dto.setImages(property.getImages().stream()
                    .map(PropertyImageDto::fromEntity)
                    .collect(Collectors.toList()));
        }

        if (property.getAmenities() != null) {
            dto.setAmenities(property.getAmenities().stream()
                    .map(AmenityDto::fromEntity)
                    .collect(Collectors.toList()));
        }

        dto.setPgDetail(PgDetailDto.fromEntity(property.getPgDetail()));
        dto.setCommercialDetail(CommercialDetailDto.fromEntity(property.getCommercialDetail()));
        dto.setPlotDetail(PlotDetailDto.fromEntity(property.getPlotDetail()));

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

    public String getOwnerPhoneMasked() {
        return ownerPhoneMasked;
    }

    public void setOwnerPhoneMasked(String ownerPhoneMasked) {
        this.ownerPhoneMasked = ownerPhoneMasked;
    }

    public String getOwnerEmailMasked() {
        return ownerEmailMasked;
    }

    public void setOwnerEmailMasked(String ownerEmailMasked) {
        this.ownerEmailMasked = ownerEmailMasked;
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
        this.isZeroBrokerage = zeroBrokerage;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
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

    public PgDetailDto getPgDetail() {
        return pgDetail;
    }

    public void setPgDetail(PgDetailDto pgDetail) {
        this.pgDetail = pgDetail;
    }

    public CommercialDetailDto getCommercialDetail() {
        return commercialDetail;
    }

    public void setCommercialDetail(CommercialDetailDto commercialDetail) {
        this.commercialDetail = commercialDetail;
    }

    public PlotDetailDto getPlotDetail() {
        return plotDetail;
    }

    public void setPlotDetail(PlotDetailDto plotDetail) {
        this.plotDetail = plotDetail;
    }
}
