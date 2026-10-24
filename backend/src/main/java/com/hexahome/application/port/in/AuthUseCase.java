package com.hexahome.application.port.in;

import com.hexahome.application.dto.auth.*;
import com.hexahome.application.dto.user.UserDto;

import java.util.UUID;

/**
 * Onion Architecture Inbound Port: Authentication & User Identity Use Case.
 */
public interface AuthUseCase {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserDto getCurrentUser(UUID userId);
}
