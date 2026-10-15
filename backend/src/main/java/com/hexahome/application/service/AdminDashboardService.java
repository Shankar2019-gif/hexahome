package com.hexahome.application.service;

import com.hexahome.application.dto.admin.dashboard.AdminActivityFeedDto;
import com.hexahome.application.dto.admin.dashboard.AdminDashboardStatsDto;
import com.hexahome.application.port.in.AdminDashboardUseCase;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.LeadRepository;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService implements AdminDashboardUseCase {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;

    public AdminDashboardService(
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            LeadRepository leadRepository,
            AdminAuditLogRepository adminAuditLogRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
        this.adminAuditLogRepository = adminAuditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardMetrics() {
        long totalListings = propertyRepository.count();
        long pendingListings = propertyRepository.countByStatus("PENDING_VERIFICATION");
        long activeListings = propertyRepository.countByStatus("ACTIVE");
        long rejectedListings = propertyRepository.countByStatus("REJECTED");

        long totalUsers = userRepository.count();
        long totalLeads = leadRepository.count();

        List<AdminAuditLog> recentLogs = adminAuditLogRepository.findTop10ByOrderByCreatedAtDesc();

        List<AdminActivityFeedDto> activityFeed = recentLogs.stream()
                .map(log -> new AdminActivityFeedDto(
                        log.getId(),
                        log.getAdmin() != null ? log.getAdmin().getUsername() : "SYSTEM",
                        log.getAction(),
                        log.getEntityType(),
                        log.getEntityId(),
                        log.getReason(),
                        log.getOutcome(),
                        log.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new AdminDashboardStatsDto(
                totalListings,
                pendingListings,
                activeListings,
                rejectedListings,
                totalUsers,
                totalLeads,
                activityFeed
        );
    }
}
