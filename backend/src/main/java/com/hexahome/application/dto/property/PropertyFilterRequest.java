package com.hexahome.application.dto.property;

import java.math.BigDecimal;
import java.util.List;

public class PropertyFilterRequest {

    private String city;
    private String locality;
    private String adType;
    private String propertyType;
    private List<String> bhk;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String furnishing;
    private String preferredTenant;
    private Boolean verifiedOnly;
    private Boolean zeroBrokerageOnly;
    private Boolean hotDealOnly;
    private String q;
    private int page = 0;
    private int size = 12;
    private String sort = "newest"; // newest, price_asc, price_desc

    public PropertyFilterRequest() {
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getAdType() {
        return adType;
    }

    public void setAdType(String adType) {
        this.adType = adType;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public List<String> getBhk() {
        return bhk;
    }

    public void setBhk(List<String> bhk) {
        this.bhk = bhk;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getFurnishing() {
        return furnishing;
    }

    public void setFurnishing(String furnishing) {
        this.furnishing = furnishing;
    }

    public String getPreferredTenant() {
        return preferredTenant;
    }

    public void setPreferredTenant(String preferredTenant) {
        this.preferredTenant = preferredTenant;
    }

    public Boolean getVerifiedOnly() {
        return verifiedOnly;
    }

    public void setVerifiedOnly(Boolean verifiedOnly) {
        this.verifiedOnly = verifiedOnly;
    }

    public Boolean getZeroBrokerageOnly() {
        return zeroBrokerageOnly;
    }

    public void setZeroBrokerageOnly(Boolean zeroBrokerageOnly) {
        this.zeroBrokerageOnly = zeroBrokerageOnly;
    }

    public Boolean getHotDealOnly() {
        return hotDealOnly;
    }

    public void setHotDealOnly(Boolean hotDealOnly) {
        this.hotDealOnly = hotDealOnly;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = Math.max(0, page);
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = (size <= 0) ? 12 : Math.min(size, 50);
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }
}
