package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.auth.AdminLoginRequest;
import com.hexahome.application.dto.admin.auth.AdminLoginResponse;
import com.hexahome.application.dto.admin.auth.AdminUserSummaryDto;

import java.util.UUID;

/**
 * Onion Architecture Inbound Port: Admin Authentication & Session Management.
 */
public interface AdminAuthUseCase {

    AdminLoginResponse login(AdminLoginRequest request, String ipAddress);

    AdminLoginResponse refresh(String refreshToken, String ipAddress);

    void logout(String refreshToken, UUID adminId);

    AdminUserSummaryDto getCurrentAdmin(UUID adminId);
}
