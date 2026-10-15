package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.system.*;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AdminSystemManagementUseCase {

    Page<AdminAuditLogResponseDto> searchAuditLogs(AdminAuditLogFilterRequest filter);

    AdminAuditLogResponseDto getAuditLogDetail(UUID logId);

    Page<AdminStaffDetailDto> searchAdminUsers(String role, Boolean isActive, String keyword, int page, int size);

    AdminStaffDetailDto createAdminUser(CreateAdminUserRequest request, UUID creatorAdminId, String ipAddress);

    AdminStaffDetailDto updateAdminUser(UUID adminId, UpdateAdminUserRequest request, UUID editorAdminId, String ipAddress);

    SystemHealthMetricsDto getSystemHealthMetrics();
}
