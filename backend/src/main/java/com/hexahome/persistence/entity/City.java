package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude = BigDecimal.ZERO;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public City() {
    }

    public City(Integer id, String name, String state, String slug, BigDecimal latitude, BigDecimal longitude, Integer displayOrder, boolean isActive) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.slug = slug;
        this.latitude = latitude;
        this.longitude = longitude;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        City city = (City) o;
        return Objects.equals(slug, city.slug);
    }

    @Override
    public int hashCode() {
        return Objects.hash(slug);
    }
}
