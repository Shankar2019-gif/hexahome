package com.hexahome.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "commercial_details")
public class CommercialDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    @JsonIgnore
    private Property property;

    @Column(name = "commercial_type", nullable = false, length = 40)
    private String commercialType; // OFFICE, SHOP, SHOWROOM, WAREHOUSE

    @Column(name = "power_load_kva", precision = 10, scale = 2)
    private BigDecimal powerLoadKva;

    @Column(name = "ceiling_height_ft", precision = 6, scale = 2)
    private BigDecimal ceilingHeightFt;

    @Column(name = "goods_lift_available", nullable = false)
    private boolean goodsLiftAvailable = false;

    @Column(name = "parking_slots", nullable = false)
    private Integer parkingSlots = 0;

    public CommercialDetail() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public String getCommercialType() {
        return commercialType;
    }

    public void setCommercialType(String commercialType) {
        this.commercialType = commercialType;
    }

    public BigDecimal getPowerLoadKva() {
        return powerLoadKva;
    }

    public void setPowerLoadKva(BigDecimal powerLoadKva) {
        this.powerLoadKva = powerLoadKva;
    }

    public BigDecimal getCeilingHeightFt() {
        return ceilingHeightFt;
    }

    public void setCeilingHeightFt(BigDecimal ceilingHeightFt) {
        this.ceilingHeightFt = ceilingHeightFt;
    }

    public boolean isGoodsLiftAvailable() {
        return goodsLiftAvailable;
    }

    public void setGoodsLiftAvailable(boolean goodsLiftAvailable) {
        this.goodsLiftAvailable = goodsLiftAvailable;
    }

    public Integer getParkingSlots() {
        return parkingSlots;
    }

    public void setParkingSlots(Integer parkingSlots) {
        this.parkingSlots = parkingSlots;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CommercialDetail that = (CommercialDetail) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
