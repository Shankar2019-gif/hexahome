package com.hexahome.application.dto.content;

import com.hexahome.persistence.entity.Project;
import java.util.UUID;

public class ProjectSummaryDto {

    private UUID id;
    private String name;
    private String builderName;
    private String slug;
    private String cityName;
    private String localityName;
    private String status;
    private String possessionDate;
    private String priceDisplay;
    private String configurations;
    private String bannerImageUrl;
    private boolean isFeatured;

    public ProjectSummaryDto() {
    }

    public ProjectSummaryDto(UUID id, String name, String builderName, String slug, String cityName, String localityName, String status, String possessionDate, String priceDisplay, String configurations, String bannerImageUrl, boolean isFeatured) {
        this.id = id;
        this.name = name;
        this.builderName = builderName;
        this.slug = slug;
        this.cityName = cityName;
        this.localityName = localityName;
        this.status = status;
        this.possessionDate = possessionDate;
        this.priceDisplay = priceDisplay;
        this.configurations = configurations;
        this.bannerImageUrl = bannerImageUrl;
        this.isFeatured = isFeatured;
    }

    public static ProjectSummaryDto fromEntity(Project project) {
        if (project == null) return null;
        return new ProjectSummaryDto(
                project.getId(),
                project.getName(),
                project.getBuilderName(),
                project.getSlug(),
                project.getCity() != null ? project.getCity().getName() : null,
                project.getLocality() != null ? project.getLocality().getName() : null,
                project.getStatus(),
                project.getPossessionDate(),
                project.getPriceDisplay(),
                project.getConfigurations(),
                project.getBannerImageUrl(),
                Boolean.TRUE.equals(project.getFeatured())
        );
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

    public String getPossessionDate() {
        return possessionDate;
    }

    public void setPossessionDate(String possessionDate) {
        this.possessionDate = possessionDate;
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

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }
}
