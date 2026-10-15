package com.hexahome.presentation.controller.admin;

import com.hexahome.application.dto.admin.auth.AdminLoginRequest;
import com.hexahome.application.dto.admin.auth.AdminLoginResponse;
import com.hexahome.application.dto.admin.auth.AdminRefreshTokenRequest;
import com.hexahome.application.dto.admin.auth.AdminUserSummaryDto;
import com.hexahome.application.port.in.AdminAuthUseCase;
import com.hexahome.infrastructure.security.AdminPrincipal;
import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/auth")
@Tag(name = "Admin Authentication", description = "Dedicated administrative login, token rotation, and session management")
public class AdminAuthController {

    private static final String REFRESH_COOKIE_NAME = "hexahome_admin_refresh";

    private final AdminAuthUseCase adminAuthService;

    public AdminAuthController(AdminAuthUseCase adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    @Operation(summary = "Admin login with credentials and session establishment")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> login(
            @Valid @RequestBody AdminLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String ipAddress = extractClientIp(httpRequest);
        AdminLoginResponse loginResponse = adminAuthService.login(request, ipAddress);

        setRefreshTokenCookie(httpResponse, loginResponse.getRefreshToken(), httpRequest.isSecure());

        return ResponseEntity.ok(ApiResponse.success("Admin authenticated successfully", loginResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and issue new access token")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String cookieRefreshToken,
            @RequestBody(required = false) AdminRefreshTokenRequest bodyRequest,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String token = (cookieRefreshToken != null && !cookieRefreshToken.isBlank())
                ? cookieRefreshToken
                : (bodyRequest != null ? bodyRequest.getRefreshToken() : null);

        String ipAddress = extractClientIp(httpRequest);
        AdminLoginResponse refreshed = adminAuthService.refresh(token, ipAddress);

        setRefreshTokenCookie(httpResponse, refreshed.getRefreshToken(), httpRequest.isSecure());

        return ResponseEntity.ok(ApiResponse.success("Admin token refreshed successfully", refreshed));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke admin session and invalidate refresh tokens")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String cookieRefreshToken,
            @RequestBody(required = false) AdminRefreshTokenRequest bodyRequest,
            @AuthenticationPrincipal AdminPrincipal admin,
            HttpServletResponse httpResponse) {

        String token = (cookieRefreshToken != null && !cookieRefreshToken.isBlank())
                ? cookieRefreshToken
                : (bodyRequest != null ? bodyRequest.getRefreshToken() : null);

        UUID adminId = admin != null ? admin.getId() : null;
        adminAuthService.logout(token, adminId);

        clearRefreshTokenCookie(httpResponse);

        return ResponseEntity.ok(ApiResponse.success("Admin logged out successfully", null));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current authenticated admin user profile", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AdminUserSummaryDto>> getMe(
            @AuthenticationPrincipal AdminPrincipal admin) {

        AdminUserSummaryDto profile = adminAuthService.getCurrentAdmin(admin.getId());
        return ResponseEntity.ok(ApiResponse.success("Admin profile retrieved successfully", profile));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken, boolean isSecure) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(isSecure)
                .path("/api/admin/auth")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false)
                .path("/api/admin/auth")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
