package com.hexahome.application.dto.property;

import com.hexahome.persistence.entity.PlotDetail;
import java.math.BigDecimal;

public class PlotDetailDto {

    private BigDecimal plotLength;
    private BigDecimal plotBreadth;
    private boolean boundaryWall;
    private boolean cornerPlot;
    private boolean gatedCommunity;
    private BigDecimal roadWidthFt;

    public PlotDetailDto() {
    }

    public static PlotDetailDto fromEntity(PlotDetail detail) {
        if (detail == null) return null;
        PlotDetailDto dto = new PlotDetailDto();
        dto.setPlotLength(detail.getPlotLength());
        dto.setPlotBreadth(detail.getPlotBreadth());
        dto.setBoundaryWall(detail.isBoundaryWall());
        dto.setCornerPlot(detail.isCornerPlot());
        dto.setGatedCommunity(detail.isGatedCommunity());
        dto.setRoadWidthFt(detail.getRoadWidthFt());
        return dto;
    }

    public BigDecimal getPlotLength() {
        return plotLength;
    }

    public void setPlotLength(BigDecimal plotLength) {
        this.plotLength = plotLength;
    }

    public BigDecimal getPlotBreadth() {
        return plotBreadth;
    }

    public void setPlotBreadth(BigDecimal plotBreadth) {
        this.plotBreadth = plotBreadth;
    }

    public boolean isBoundaryWall() {
        return boundaryWall;
    }

    public void setBoundaryWall(boolean boundaryWall) {
        this.boundaryWall = boundaryWall;
    }

    public boolean isCornerPlot() {
        return cornerPlot;
    }

    public void setCornerPlot(boolean cornerPlot) {
        this.cornerPlot = cornerPlot;
    }

    public boolean isGatedCommunity() {
        return gatedCommunity;
    }

    public void setGatedCommunity(boolean gatedCommunity) {
        this.gatedCommunity = gatedCommunity;
    }

    public BigDecimal getRoadWidthFt() {
        return roadWidthFt;
    }

    public void setRoadWidthFt(BigDecimal roadWidthFt) {
        this.roadWidthFt = roadWidthFt;
    }
}
