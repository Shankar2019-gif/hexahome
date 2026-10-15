package com.hexahome.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "plot_details")
public class PlotDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false, unique = true)
    @JsonIgnore
    private Property property;

    @Column(name = "plot_length", precision = 10, scale = 2)
    private BigDecimal plotLength;

    @Column(name = "plot_breadth", precision = 10, scale = 2)
    private BigDecimal plotBreadth;

    @Column(name = "boundary_wall", nullable = false)
    private boolean boundaryWall = false;

    @Column(name = "corner_plot", nullable = false)
    private boolean cornerPlot = false;

    @Column(name = "gated_community", nullable = false)
    private boolean gatedCommunity = false;

    @Column(name = "road_width_ft", precision = 6, scale = 2)
    private BigDecimal roadWidthFt;

    public PlotDetail() {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlotDetail that = (PlotDetail) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
