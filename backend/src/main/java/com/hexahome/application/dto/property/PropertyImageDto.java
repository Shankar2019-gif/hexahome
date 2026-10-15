package com.hexahome.application.dto.property;

import com.hexahome.persistence.entity.PropertyImage;

import java.util.UUID;

public class PropertyImageDto {

    private UUID id;
    private String imageUrl;
    private String thumbnailUrl;
    private String caption;
    private Integer displayOrder;
    private boolean isCover;

    public PropertyImageDto() {
    }

    public PropertyImageDto(UUID id, String imageUrl, String thumbnailUrl, String caption, Integer displayOrder, boolean isCover) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.caption = caption;
        this.displayOrder = displayOrder;
        this.isCover = isCover;
    }

    public static PropertyImageDto fromEntity(PropertyImage image) {
        if (image == null) return null;
        return new PropertyImageDto(
                image.getId(),
                image.getImageUrl(),
                image.getThumbnailUrl(),
                image.getCaption(),
                image.getDisplayOrder(),
                image.isCover()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isCover() {
        return isCover;
    }

    public void setCover(boolean cover) {
        isCover = cover;
    }
}
