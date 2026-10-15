package com.hexahome.application.service;

import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.domain.exception.UnauthorizedException;
import com.hexahome.application.dto.auth.*;
import com.hexahome.application.dto.user.UserDto;
import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.RoleRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.infrastructure.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService implements com.hexahome.application.port.in.AuthUseCase {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            OtpService otpService,
            JwtService jwtService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String cleanIdentifier = request.getUsername().trim();
        String password = request.getPassword();

        String cleanPhone = cleanIdentifier.replaceAll("\\D", "");
        if (cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
        }

        Optional<User> userOpt = userRepository.findByIdentifier(cleanIdentifier);
        if (userOpt.isEmpty() && cleanPhone.length() == 10) {
            userOpt = userRepository.findByPhone(cleanPhone);
        }

        if (userOpt.isEmpty()) {
            throw new BadRequestException("No registered account found with this username, email, or mobile number.");
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        if (StringUtils.hasText(user.getPasswordHash())) {
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                throw new BadRequestException("Incorrect password. Please verify and try again.");
            }
        } else {
            user.setPasswordHash(passwordEncoder.encode(password));
            userRepository.save(user);
        }

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getPhone(), roleNames);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        log.info("User logged in successfully: id={}, phone={}", user.getId(), user.getPhone());
        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                UserDto.fromEntity(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanPhone = request.getPhone().replaceAll("\\D", "");
        if (cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
        }
        if (cleanPhone.length() != 10) {
            throw new BadRequestException("Please enter a valid 10-digit mobile number.");
        }

        String email = StringUtils.hasText(request.getEmail()) ? request.getEmail().trim() : null;
        if (email != null && userRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("An account with this email already exists.");
        }

        Optional<User> existingUserOpt = userRepository.findByPhone(cleanPhone);
        if (existingUserOpt.isPresent()) {
            User existing = existingUserOpt.get();
            existing.setFirstName(request.getFirstName().trim());
            existing.setLastName(request.getLastName().trim());
            existing.setName(request.getName() != null && !request.getName().isBlank()
                    ? request.getName().trim()
                    : (request.getFirstName().trim() + " " + request.getLastName().trim()));
            if (email != null) existing.setEmail(email);
            if (StringUtils.hasText(request.getProfilePicUrl())) existing.setProfilePicUrl(request.getProfilePicUrl().trim());
            existing.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            existing.setVerified(true);

            String roleName = determineRoleName(request.getRole());
            roleRepository.findByName(roleName).ifPresent(r -> existing.setRoles(Set.of(r)));

            User saved = userRepository.save(existing);
            List<String> roleNames = saved.getRoles().stream().map(Role::getName).collect(Collectors.toList());
            String accessToken = jwtService.generateAccessToken(saved.getId(), saved.getPhone(), roleNames);
            String refreshToken = jwtService.generateRefreshToken(saved.getId());

            return new AuthResponse(accessToken, refreshToken, jwtService.getAccessExpirationMs() / 1000, UserDto.fromEntity(saved));
        }

        User user = new User();
        user.setPhone(cleanPhone);
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        String fullName = request.getName() != null && !request.getName().isBlank()
                ? request.getName().trim()
                : (request.getFirstName().trim() + " " + request.getLastName().trim());
        user.setName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setProfilePicUrl(StringUtils.hasText(request.getProfilePicUrl()) ? request.getProfilePicUrl().trim() : null);
        user.setVerified(true);
        user.setActive(true);

        String roleName = determineRoleName(request.getRole());
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("ROLE_TENANT")
                        .orElseThrow(() -> new IllegalStateException("Default role ROLE_TENANT not found")));
        user.setRoles(Set.of(role));

        User saved = userRepository.save(user);
        log.info("New user registered via form: id={}, phone={}, role={}", saved.getId(), saved.getPhone(), role.getName());

        List<String> roleNames = saved.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        String accessToken = jwtService.generateAccessToken(saved.getId(), saved.getPhone(), roleNames);
        String refreshToken = jwtService.generateRefreshToken(saved.getId());

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                UserDto.fromEntity(saved)
        );
    }

    public SendOtpResponse sendOtp(SendOtpRequest request) {
        String phone = request.getPhone().trim();
        otpService.generateAndSendOtp(phone);

        return new SendOtpResponse(
                phone,
                otpService.getOtpValiditySeconds(),
                "6-digit OTP code dispatched for +91-" + phone + ". Please enter the code received on your phone."
        );
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String phone = request.getPhone().trim();
        String otp = request.getOtp().trim();

        // 1. Validate OTP
        otpService.verifyOtp(phone, otp);

        // 2. Find or Register User
        Optional<User> existingUserOpt = userRepository.findByPhone(phone);
        User user;

        String resolvedName = request.getName();
        if (!StringUtils.hasText(resolvedName) && (StringUtils.hasText(request.getFirstName()) || StringUtils.hasText(request.getLastName()))) {
            String fName = request.getFirstName() != null ? request.getFirstName().trim() : "";
            String lName = request.getLastName() != null ? request.getLastName().trim() : "";
            resolvedName = (fName + " " + lName).trim();
        }

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (!user.isActive()) {
                throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
            }
            if (!user.isVerified()) {
                user.setVerified(true);
            }
            if (StringUtils.hasText(resolvedName)) {
                user.setName(resolvedName.trim());
            }
            if (StringUtils.hasText(request.getEmail())) {
                user.setEmail(request.getEmail().trim());
            }
            if (StringUtils.hasText(request.getProfilePicUrl())) {
                user.setProfilePicUrl(request.getProfilePicUrl().trim());
            }
            if (StringUtils.hasText(request.getRole())) {
                String roleName = determineRoleName(request.getRole());
                Optional<Role> roleOpt = roleRepository.findByName(roleName);
                if (roleOpt.isPresent()) {
                    user.setRoles(Set.of(roleOpt.get()));
                }
            }
            user = userRepository.save(user);
        } else {
            // New user registration with all user details
            user = new User();
            user.setPhone(phone);
            user.setName(StringUtils.hasText(resolvedName) ? resolvedName.trim() : "User " + phone.substring(6));
            user.setEmail(StringUtils.hasText(request.getEmail()) ? request.getEmail().trim() : null);
            user.setProfilePicUrl(StringUtils.hasText(request.getProfilePicUrl()) ? request.getProfilePicUrl().trim() : null);
            user.setVerified(true);
            user.setActive(true);

            // Assign role
            String roleName = determineRoleName(request.getRole());
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.findByName("ROLE_TENANT")
                            .orElseThrow(() -> new IllegalStateException("Default role ROLE_TENANT not found")));
            user.setRoles(Set.of(role));

            user = userRepository.save(user);
            log.info("New user registered successfully: id={}, phone={}, role={}, name={}", user.getId(), user.getPhone(), role.getName(), user.getName());
        }

        // 3. Generate Tokens
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getPhone(), roleNames);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                UserDto.fromEntity(user)
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtService.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token. Please login again.");
        }

        String tokenType = jwtService.extractTokenType(refreshToken);
        if (!"refresh".equalsIgnoreCase(tokenType)) {
            throw new BadRequestException("Supplied token is not a valid refresh token.");
        }

        UUID userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User associated with this token no longer exists."));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive.");
        }

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getPhone(), roleNames);
        String newRefreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                jwtService.getAccessExpirationMs() / 1000,
                UserDto.fromEntity(user)
        );
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserDto.fromEntity(user);
    }

    private String determineRoleName(String requestedRole) {
        if (!StringUtils.hasText(requestedRole)) {
            return "ROLE_TENANT";
        }
        String cleanRole = requestedRole.trim().toUpperCase();
        if (!cleanRole.startsWith("ROLE_")) {
            cleanRole = "ROLE_" + cleanRole;
        }

        return switch (cleanRole) {
            case "ROLE_BUILDER", "BUILDER" -> "ROLE_BUILDER";
            case "ROLE_OWNER", "OWNER" -> "ROLE_OWNER";
            case "ROLE_BUYER", "BUYER" -> "ROLE_BUYER";
            case "ROLE_AGENT", "AGENT" -> "ROLE_AGENT";
            case "ROLE_PG_OWNER", "PG_OWNER" -> "ROLE_PG_OWNER";
            case "ROLE_LANDLORD", "LANDLORD" -> "ROLE_LANDLORD";
            default -> "ROLE_TENANT";
        };
    }
}
