package com.hexahome.application.dto.property;

import com.hexahome.persistence.entity.PgDetail;
import java.math.BigDecimal;

public class PgDetailDto {

    private String genderAllowed;
    private String sharingTypes;
    private boolean foodIncluded;
    private String mealsProvided;
    private String noticePeriod;
    private BigDecimal depositMonths;
    private String gateClosingTime;

    public PgDetailDto() {
    }

    public static PgDetailDto fromEntity(PgDetail detail) {
        if (detail == null) return null;
        PgDetailDto dto = new PgDetailDto();
        dto.setGenderAllowed(detail.getGenderAllowed());
        dto.setSharingTypes(detail.getSharingTypes());
        dto.setFoodIncluded(detail.isFoodIncluded());
        dto.setMealsProvided(detail.getMealsProvided());
        dto.setNoticePeriod(detail.getNoticePeriod());
        dto.setDepositMonths(detail.getDepositMonths());
        dto.setGateClosingTime(detail.getGateClosingTime());
        return dto;
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
}
