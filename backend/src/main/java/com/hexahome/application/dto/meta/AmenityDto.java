package com.hexahome.application.dto.meta;

import com.hexahome.persistence.entity.Amenity;

public class AmenityDto {

    private Integer id;
    private String code;
    private String name;
    private String iconUrl;
    private String category;

    public AmenityDto() {
    }

    public AmenityDto(Integer id, String code, String name, String iconUrl, String category) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.iconUrl = iconUrl;
        this.category = category;
    }

    public static AmenityDto fromEntity(Amenity amenity) {
        if (amenity == null) return null;
        return new AmenityDto(
                amenity.getId(),
                amenity.getCode(),
                amenity.getName(),
                amenity.getIconUrl(),
                amenity.getCategory()
        );
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
