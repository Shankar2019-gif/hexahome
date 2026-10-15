package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "builder_name", nullable = false, length = 150)
    private String builderName;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id")
    private Locality locality;

    @Column(nullable = false, length = 50)
    private String status = "UNDER_CONSTRUCTION"; // UNDER_CONSTRUCTION, READY_TO_MOVE, NEW_LAUNCH

    @Column(name = "launch_year")
    private Integer launchYear;

    @Column(name = "possession_date", length = 50)
    private String possessionDate;

    @Column(name = "min_price", precision = 15, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", precision = 15, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "price_display", length = 100)
    private String priceDisplay;

    @Column(length = 100)
    private String configurations;

    @Column(name = "banner_image_url", length = 500)
    private String bannerImageUrl;

    @Column(name = "brochure_url", length = 500)
    private String brochureUrl;

    @Column(name = "rera_id", length = 100)
    private String reraId;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Project() {
    }

    public Project(String name, String builderName, String slug, City city, Locality locality, String status,
                   Integer launchYear, String possessionDate, BigDecimal minPrice, BigDecimal maxPrice,
                   String priceDisplay, String configurations, String bannerImageUrl, String reraId,
                   String description, Boolean isFeatured) {
        this.name = name;
        this.builderName = builderName;
        this.slug = slug;
        this.city = city;
        this.locality = locality;
        this.status = status;
        this.launchYear = launchYear;
        this.possessionDate = possessionDate;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.priceDisplay = priceDisplay;
        this.configurations = configurations;
        this.bannerImageUrl = bannerImageUrl;
        this.reraId = reraId;
        this.description = description;
        this.isFeatured = isFeatured != null ? isFeatured : false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBuilderName() {
        return builderName;
    }

    public void setBuilderName(String builderName) {
        this.builderName = builderName;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getLaunchYear() {
        return launchYear;
    }

    public void setLaunchYear(Integer launchYear) {
        this.launchYear = launchYear;
    }

    public String getPossessionDate() {
        return possessionDate;
    }

    public void setPossessionDate(String possessionDate) {
        this.possessionDate = possessionDate;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getPriceDisplay() {
        return priceDisplay;
    }

    public void setPriceDisplay(String priceDisplay) {
        this.priceDisplay = priceDisplay;
    }

    public String getConfigurations() {
        return configurations;
    }

    public void setConfigurations(String configurations) {
        this.configurations = configurations;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public String getBrochureUrl() {
        return brochureUrl;
    }

    public void setBrochureUrl(String brochureUrl) {
        this.brochureUrl = brochureUrl;
    }

    public String getReraId() {
        return reraId;
    }

    public void setReraId(String reraId) {
        this.reraId = reraId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getFeatured() {
        return isFeatured;
    }

    public void setFeatured(Boolean featured) {
        isFeatured = featured;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return Objects.equals(id, project.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
