package com.hexahome.application.dto.billing;

import com.hexahome.persistence.entity.Plan;
import java.math.BigDecimal;

public class PlanDto {

    private String id;
    private String name;
    private String targetRole;
    private BigDecimal priceInr;
    private Integer validityDays;
    private Integer contactCredits;
    private boolean hasAssistedManager;
    private boolean instantWhatsappAlerts;

    public PlanDto() {
    }

    public static PlanDto fromEntity(Plan plan) {
        if (plan == null) return null;
        PlanDto dto = new PlanDto();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setTargetRole(plan.getTargetRole());
        dto.setPriceInr(plan.getPriceInr());
        dto.setValidityDays(plan.getValidityDays());
        dto.setContactCredits(plan.getContactCredits());
        dto.setHasAssistedManager(plan.isHasAssistedManager());
        dto.setInstantWhatsappAlerts(plan.isInstantWhatsappAlerts());
        return dto;
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
}
