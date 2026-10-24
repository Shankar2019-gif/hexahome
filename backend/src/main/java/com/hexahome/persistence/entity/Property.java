package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @Column(name = "short_id", nullable = false, unique = true, length = 10)
    private String shortId;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id", nullable = false)
    private Locality locality;

    @Column(name = "ad_type", nullable = false, length = 20)
    private String adType; // RENT, SALE, PLOT, PG

    @Column(name = "property_type", nullable = false, length = 30)
    private String propertyType; // FLAT, HOUSE, VILLA, COMMERCIAL, PLOT, PG

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(precision = 14, scale = 2)
    private BigDecimal deposit = BigDecimal.ZERO;

    @Column(name = "maintenance_charges", precision = 10, scale = 2)
    private BigDecimal maintenanceCharges = BigDecimal.ZERO;

    @Column(name = "is_maintenance_included", nullable = false)
    private boolean isMaintenanceIncluded = true;

    @Column(length = 20)
    private String bhk; // 1 RK, 1 BHK, 2 BHK, 3 BHK, etc.

    @Column(name = "bedrooms")
    private Integer bedrooms = 0;

    @Column(name = "bathrooms")
    private Integer bathrooms = 0;

    @Column(name = "balconies")
    private Integer balconies = 0;

    @Column(name = "built_up_area", nullable = false, precision = 10, scale = 2)
    private BigDecimal builtUpArea;

    @Column(name = "carpet_area", precision = 10, scale = 2)
    private BigDecimal carpetArea;

    @Column(length = 30)
    private String furnishing = "UNFURNISHED"; // FULLY_FURNISHED, SEMI_FURNISHED, UNFURNISHED

    @Column(name = "preferred_tenant", length = 30)
    private String preferredTenant = "ANY"; // FAMILY, BACHELORS, COMPANY, ANY

    @Column(length = 30)
    private String facing;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "available_from")
    private LocalDate availableFrom = LocalDate.now();

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 30)
    private String status = "PENDING_VERIFICATION"; // ACTIVE, PENDING_VERIFICATION, INACTIVE

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "is_zero_brokerage", nullable = false)
    private boolean isZeroBrokerage = true;

    @Column(name = "is_hot_deal", nullable = false)
    private boolean isHotDeal = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @org.hibernate.annotations.BatchSize(size = 25)
    private List<PropertyImage> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "property_amenities",
            joinColumns = @JoinColumn(name = "property_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @org.hibernate.annotations.BatchSize(size = 25)
    private Set<Amenity> amenities = new HashSet<>();

    @OneToOne(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PgDetail pgDetail;

    @OneToOne(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CommercialDetail commercialDetail;

    @OneToOne(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PlotDetail plotDetail;

    public Property() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Locality getLocality() {
        return locality;
    }

    public void setLocality(Locality locality) {
        this.locality = locality;
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

    public List<PropertyImage> getImages() {
        return images;
    }

    public void setImages(List<PropertyImage> images) {
        this.images = (images != null) ? new ArrayList<>(images) : new ArrayList<>();
    }

    public void addImage(PropertyImage image) {
        this.images.add(image);
        image.setProperty(this);
    }

    public Set<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<Amenity> amenities) {
        this.amenities = (amenities != null) ? new HashSet<>(amenities) : new HashSet<>();
    }

    public PgDetail getPgDetail() {
        return pgDetail;
    }

    public void setPgDetail(PgDetail pgDetail) {
        this.pgDetail = pgDetail;
        if (pgDetail != null) pgDetail.setProperty(this);
    }

    public CommercialDetail getCommercialDetail() {
        return commercialDetail;
    }

    public void setCommercialDetail(CommercialDetail commercialDetail) {
        this.commercialDetail = commercialDetail;
        if (commercialDetail != null) commercialDetail.setProperty(this);
    }

    public PlotDetail getPlotDetail() {
        return plotDetail;
    }

    public void setPlotDetail(PlotDetail plotDetail) {
        this.plotDetail = plotDetail;
        if (plotDetail != null) plotDetail.setProperty(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Property property = (Property) o;
        return Objects.equals(slug, property.slug);
    }

    @Override
    public int hashCode() {
        return Objects.hash(slug);
    }
}
