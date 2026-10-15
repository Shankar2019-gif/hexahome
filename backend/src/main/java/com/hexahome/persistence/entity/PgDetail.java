package com.hexahome.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "pg_details")
public class PgDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    @JsonIgnore
    private Property property;

    @Column(name = "gender_allowed", nullable = false, length = 20)
    private String genderAllowed; // MALE, FEMALE, CO_LIVING

    @Column(name = "sharing_types", nullable = false, length = 50)
    private String sharingTypes; // SINGLE, DOUBLE, TRIPLE

    @Column(name = "food_included", nullable = false)
    private boolean foodIncluded = true;

    @Column(name = "meals_provided", length = 50)
    private String mealsProvided = "BREAKFAST_DINNER";

    @Column(name = "notice_period", length = 30)
    private String noticePeriod = "30_DAYS";

    @Column(name = "deposit_months", precision = 4, scale = 1)
    private BigDecimal depositMonths = BigDecimal.valueOf(2.0);

    @Column(name = "gate_closing_time", length = 20)
    private String gateClosingTime = "22:30";

    public PgDetail() {
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

    public String getGenderAllowed() {
        return genderAllowed;
    }

    public void setGenderAllowed(String genderAllowed) {
        this.genderAllowed = genderAllowed;
    }

    public String getSharingTypes() {
        return sharingTypes;
    }

    public void setSharingTypes(String sharingTypes) {
        this.sharingTypes = sharingTypes;
    }

    public boolean isFoodIncluded() {
        return foodIncluded;
    }

    public void setFoodIncluded(boolean foodIncluded) {
        this.foodIncluded = foodIncluded;
    }

    public String getMealsProvided() {
        return mealsProvided;
    }

    public void setMealsProvided(String mealsProvided) {
        this.mealsProvided = mealsProvided;
    }

    public String getNoticePeriod() {
        return noticePeriod;
    }

    public void setNoticePeriod(String noticePeriod) {
        this.noticePeriod = noticePeriod;
    }

    public BigDecimal getDepositMonths() {
        return depositMonths;
    }

    public void setDepositMonths(BigDecimal depositMonths) {
        this.depositMonths = depositMonths;
    }

    public String getGateClosingTime() {
        return gateClosingTime;
    }

    public void setGateClosingTime(String gateClosingTime) {
        this.gateClosingTime = gateClosingTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PgDetail pgDetail = (PgDetail) o;
        return Objects.equals(id, pgDetail.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
