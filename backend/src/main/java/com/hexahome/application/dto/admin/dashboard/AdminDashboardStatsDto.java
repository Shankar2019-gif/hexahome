package com.hexahome.application.dto.admin.dashboard;

import java.util.List;

public class AdminDashboardStatsDto {

    private long totalListings;
    private long pendingListings;
    private long activeListings;
    private long rejectedListings;
    private long totalUsers;
    private long totalLeads;
    private List<AdminActivityFeedDto> recentActivities;

    public AdminDashboardStatsDto() {
    }

    public AdminDashboardStatsDto(
            long totalListings,
            long pendingListings,
            long activeListings,
            long rejectedListings,
            long totalUsers,
            long totalLeads,
            List<AdminActivityFeedDto> recentActivities) {
        this.totalListings = totalListings;
        this.pendingListings = pendingListings;
        this.activeListings = activeListings;
        this.rejectedListings = rejectedListings;
        this.totalUsers = totalUsers;
        this.totalLeads = totalLeads;
        this.recentActivities = recentActivities;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getPendingListings() {
        return pendingListings;
    }

    public void setPendingListings(long pendingListings) {
        this.pendingListings = pendingListings;
    }

    public long getActiveListings() {
        return activeListings;
    }

    public void setActiveListings(long activeListings) {
        this.activeListings = activeListings;
    }

    public long getRejectedListings() {
        return rejectedListings;
    }

    public void setRejectedListings(long rejectedListings) {
        this.rejectedListings = rejectedListings;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalLeads() {
        return totalLeads;
    }

    public void setTotalLeads(long totalLeads) {
        this.totalLeads = totalLeads;
    }

    public List<AdminActivityFeedDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<AdminActivityFeedDto> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
