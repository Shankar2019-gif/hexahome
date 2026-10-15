package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "target_role", nullable = false, length = 50)
    private String targetRole; // TENANT, OWNER, BUYER

    @Column(name = "price_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceInr;

    @Column(name = "validity_days", nullable = false)
    private Integer validityDays;

    @Column(name = "contact_credits", nullable = false)
    private Integer contactCredits;

    @Column(name = "has_assisted_manager", nullable = false)
    private boolean hasAssistedManager = false;

    @Column(name = "instant_whatsapp_alerts", nullable = false)
    private boolean instantWhatsappAlerts = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public Plan() {
    }

    public Plan(String id, String name, String targetRole, BigDecimal priceInr, Integer validityDays, Integer contactCredits) {
        this.id = id;
        this.name = name;
        this.targetRole = targetRole;
        this.priceInr = priceInr;
        this.validityDays = validityDays;
        this.contactCredits = contactCredits;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public BigDecimal getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(BigDecimal priceInr) {
        this.priceInr = priceInr;
    }

    public Integer getValidityDays() {
        return validityDays;
    }

    public void setValidityDays(Integer validityDays) {
        this.validityDays = validityDays;
    }

    public Integer getContactCredits() {
        return contactCredits;
    }

    public void setContactCredits(Integer contactCredits) {
        this.contactCredits = contactCredits;
    }

    public boolean isHasAssistedManager() {
        return hasAssistedManager;
    }

    public void setHasAssistedManager(boolean hasAssistedManager) {
        this.hasAssistedManager = hasAssistedManager;
    }

    public boolean isInstantWhatsappAlerts() {
        return instantWhatsappAlerts;
    }

    public void setInstantWhatsappAlerts(boolean instantWhatsappAlerts) {
        this.instantWhatsappAlerts = instantWhatsappAlerts;
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
        Plan plan = (Plan) o;
        return Objects.equals(id, plan.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
