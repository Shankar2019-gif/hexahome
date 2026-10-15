package com.hexahome.application.dto.property;

import com.hexahome.persistence.entity.CommercialDetail;
import java.math.BigDecimal;

public class CommercialDetailDto {

    private String commercialType;
    private BigDecimal powerLoadKva;
    private BigDecimal ceilingHeightFt;
    private boolean goodsLiftAvailable;
    private Integer parkingSlots;

    public CommercialDetailDto() {
    }

    public static CommercialDetailDto fromEntity(CommercialDetail detail) {
        if (detail == null) return null;
        CommercialDetailDto dto = new CommercialDetailDto();
        dto.setCommercialType(detail.getCommercialType());
        dto.setPowerLoadKva(detail.getPowerLoadKva());
        dto.setCeilingHeightFt(detail.getCeilingHeightFt());
        dto.setGoodsLiftAvailable(detail.isGoodsLiftAvailable());
        dto.setParkingSlots(detail.getParkingSlots());
        return dto;
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
}
