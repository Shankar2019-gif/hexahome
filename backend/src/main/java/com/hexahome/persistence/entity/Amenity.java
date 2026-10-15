package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "amenities")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Column(nullable = false, length = 50)
    private String category = "GENERAL";

    public Amenity() {
    }

    public Amenity(Integer id, String code, String name, String iconUrl, String category) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.iconUrl = iconUrl;
        this.category = category;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Amenity amenity = (Amenity) o;
        return Objects.equals(code, amenity.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
