package com.hexahome.application.dto.content;

import com.hexahome.persistence.entity.Project;
import java.math.BigDecimal;
import java.util.UUID;

public class ProjectDetailDto {

    private UUID id;
    private String name;
    private String builderName;
    private String slug;
    private String cityName;
    private String localityName;
    private String status;
    private Integer launchYear;
    private String possessionDate;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceDisplay;
    private String configurations;
    private String bannerImageUrl;
    private String brochureUrl;
    private String reraId;
    private String description;
    private boolean isFeatured;

    public ProjectDetailDto() {
    }

    public static ProjectDetailDto fromEntity(Project project) {
        if (project == null) return null;
        ProjectDetailDto dto = new ProjectDetailDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setBuilderName(project.getBuilderName());
        dto.setSlug(project.getSlug());
        if (project.getCity() != null) dto.setCityName(project.getCity().getName());
        if (project.getLocality() != null) dto.setLocalityName(project.getLocality().getName());
        dto.setStatus(project.getStatus());
        dto.setLaunchYear(project.getLaunchYear());
        dto.setPossessionDate(project.getPossessionDate());
        dto.setMinPrice(project.getMinPrice());
        dto.setMaxPrice(project.getMaxPrice());
        dto.setPriceDisplay(project.getPriceDisplay());
        dto.setConfigurations(project.getConfigurations());
        dto.setBannerImageUrl(project.getBannerImageUrl());
        dto.setBrochureUrl(project.getBrochureUrl());
        dto.setReraId(project.getReraId());
        dto.setDescription(project.getDescription());
        dto.setFeatured(Boolean.TRUE.equals(project.getFeatured()));
        return dto;
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

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getLocalityName() {
        return localityName;
    }

    public void setLocalityName(String localityName) {
        this.localityName = localityName;
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

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }
}
