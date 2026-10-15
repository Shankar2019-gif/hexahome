package com.hexahome.application.dto.property;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreatePropertyRequest {

    private Integer cityId;
    private String city;

    private Integer localityId;
    private String locality;

    private String adType;
    private String listingType;

    private String propertyType;
    private String category;

    private String title;
    private String description;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal deposit;
    private BigDecimal securityDeposit;

    private BigDecimal maintenanceCharges = BigDecimal.ZERO;
    private boolean maintenanceIncluded = true;

    private String bhk;
    private Integer bedrooms = 0;
    private Integer bathrooms = 0;
    private Integer balconies = 0;

    private BigDecimal builtUpArea;
    private BigDecimal areaSqFt;

    private BigDecimal carpetArea;
    private String furnishing = "UNFURNISHED";
    private String preferredTenant = "ANY";
    private String facing;
    private Integer floorNumber;
    private Integer totalFloors;
    private LocalDate availableFrom = LocalDate.now();

    private BigDecimal latitude;
    private BigDecimal longitude;

    private String address;

    private List<String> imageUrls;
    private List<Integer> amenityIds;

    // Specialized Subtype Details
    private PgDetailDto pgDetail;
    private CommercialDetailDto commercialDetail;
    private PlotDetailDto plotDetail;

    // Contact info passed from wizard
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    public CreatePropertyRequest() {
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getLocalityId() {
        return localityId;
    }

    public void setLocalityId(Integer localityId) {
        this.localityId = localityId;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getAdType() {
        if (adType != null && !adType.isBlank()) {
            return adType;
        }
        if (listingType != null && !listingType.isBlank()) {
            return listingType;
        }
        return "RENT";
    }

    public void setAdType(String adType) {
        this.adType = adType;
    }

    public String getListingType() {
        return listingType;
    }

    public void setListingType(String listingType) {
        this.listingType = listingType;
    }

    public String getPropertyType() {
        if (propertyType != null && !propertyType.isBlank()) {
            return propertyType;
        }
        if (category != null && !category.isBlank()) {
            return category.equalsIgnoreCase("RESIDENTIAL") ? "FLAT" : category;
        }
        return "FLAT";
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        if (title != null && !title.isBlank()) {
            return title;
        }
        String bhkStr = bhk != null ? bhk : "2 BHK";
        String locStr = locality != null ? locality : "Central";
        String cityStr = city != null ? city : "Coimbatore";
        String typeStr = getAdType().equalsIgnoreCase("RENT") ? "Rent" : "Sale";
        return bhkStr + " Apartment for " + typeStr + " in " + locStr + ", " + cityStr;
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

    public BigDecimal getPrice() {
        return price != null ? price : BigDecimal.valueOf(25000);
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDeposit() {
        if (deposit != null) {
            return deposit;
        }
        if (securityDeposit != null) {
            return securityDeposit;
        }
        return BigDecimal.ZERO;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getMaintenanceCharges() {
        return maintenanceCharges != null ? maintenanceCharges : BigDecimal.ZERO;
    }

    public void setMaintenanceCharges(BigDecimal maintenanceCharges) {
        this.maintenanceCharges = maintenanceCharges;
    }

    public boolean isMaintenanceIncluded() {
        return maintenanceIncluded;
    }

    public void setMaintenanceIncluded(boolean maintenanceIncluded) {
        this.maintenanceIncluded = maintenanceIncluded;
    }

    public String getBhk() {
        return bhk != null && !bhk.isBlank() ? bhk : "2 BHK";
    }

    public void setBhk(String bhk) {
        this.bhk = bhk;
    }

    public Integer getBedrooms() {
        if (bedrooms != null && bedrooms > 0) return bedrooms;
        if (bhk != null) {
            if (bhk.contains("1")) return 1;
            if (bhk.contains("2")) return 2;
            if (bhk.contains("3")) return 3;
            if (bhk.contains("4")) return 4;
            if (bhk.contains("5")) return 5;
        }
        return 2;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms != null && bathrooms > 0 ? bathrooms : 2;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Integer getBalconies() {
        return balconies != null ? balconies : 1;
    }

    public void setBalconies(Integer balconies) {
        this.balconies = balconies;
    }

    public BigDecimal getBuiltUpArea() {
        if (builtUpArea != null) {
            return builtUpArea;
        }
        if (areaSqFt != null) {
            return areaSqFt;
        }
        return BigDecimal.valueOf(1150);
    }

    public void setBuiltUpArea(BigDecimal builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public BigDecimal getAreaSqFt() {
        return areaSqFt;
    }

    public void setAreaSqFt(BigDecimal areaSqFt) {
        this.areaSqFt = areaSqFt;
    }

    public BigDecimal getCarpetArea() {
        return carpetArea;
    }

    public void setCarpetArea(BigDecimal carpetArea) {
        this.carpetArea = carpetArea;
    }

    public String getFurnishing() {
        return furnishing != null && !furnishing.isBlank() ? furnishing : "UNFURNISHED";
    }

    public void setFurnishing(String furnishing) {
        this.furnishing = furnishing;
    }

    public String getPreferredTenant() {
        return preferredTenant != null && !preferredTenant.isBlank() ? preferredTenant : "ANY";
    }

    public void setPreferredTenant(String preferredTenant) {
        this.preferredTenant = preferredTenant;
    }

    public String getFacing() {
        return facing != null ? facing : "EAST";
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
        return availableFrom != null ? availableFrom : LocalDate.now();
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
        if (address != null && !address.isBlank()) {
            return address;
        }
        String locStr = locality != null ? locality : "Central";
        String cityStr = city != null ? city : "Coimbatore";
        return locStr + ", " + cityStr;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<Integer> getAmenityIds() {
        return amenityIds;
    }

    public void setAmenityIds(List<Integer> amenityIds) {
        this.amenityIds = amenityIds;
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
