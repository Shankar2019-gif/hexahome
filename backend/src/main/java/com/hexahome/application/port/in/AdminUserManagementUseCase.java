package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.user.*;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AdminUserManagementUseCase {

    Page<AdminUserProfileSummaryDto> searchUsers(AdminUserFilterRequest request);

    AdminUserProfileDetailDto getUserDetail(UUID userId);

    void blockUser(UUID userId, UserBlockActionRequest request, UUID adminId, String ipAddress);

    void unblockUser(UUID userId, UserBlockActionRequest request, UUID adminId, String ipAddress);

    RevealPiiResponse revealUserPii(UUID userId, RevealPiiRequest request, UUID adminId, String ipAddress);
}
