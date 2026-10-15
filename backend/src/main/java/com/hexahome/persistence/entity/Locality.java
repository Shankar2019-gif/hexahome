package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "localities")
public class Locality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String slug;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude = BigDecimal.ZERO;

    @Column(name = "pin_code")
    private Integer pinCode;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    public Locality() {
    }

    public Locality(Integer id, City city, String name, String slug, BigDecimal latitude, BigDecimal longitude, Integer pinCode, Integer displayOrder) {
        this.id = id;
        this.city = city;
        this.name = name;
        this.slug = slug;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pinCode = pinCode;
        this.displayOrder = displayOrder;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getPinCode() {
        return pinCode;
    }

    public void setPinCode(Integer pinCode) {
        this.pinCode = pinCode;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Locality locality = (Locality) o;
        return Objects.equals(id, locality.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
