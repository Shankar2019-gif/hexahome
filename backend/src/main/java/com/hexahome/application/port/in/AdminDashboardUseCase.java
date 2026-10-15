package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.dashboard.AdminDashboardStatsDto;

/**
 * Onion Architecture Inbound Port: Admin Operational Dashboard.
 */
public interface AdminDashboardUseCase {

    AdminDashboardStatsDto getDashboardMetrics();
}
