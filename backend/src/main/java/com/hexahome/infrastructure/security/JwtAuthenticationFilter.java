package com.hexahome.infrastructure.security;

import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.AdminUserRepository;
import com.hexahome.persistence.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AdminUserRepository adminUserRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository,
            AdminUserRepository adminUserRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtService.validateToken(jwt)) {
                String tokenType = jwtService.extractTokenType(jwt);
                if ("access".equalsIgnoreCase(tokenType)) {
                    UUID userId = jwtService.extractUserId(jwt);
                    String userType = jwtService.extractUserType(jwt);

                    if ("ADMIN".equalsIgnoreCase(userType)) {
                        Optional<AdminUser> adminOpt = adminUserRepository.findById(userId);
                        if (adminOpt.isPresent() && adminOpt.get().isActive() && !adminOpt.get().isAccountLocked()) {
                            AdminUser admin = adminOpt.get();
                            AdminPrincipal principal = AdminPrincipal.fromEntity(admin);

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    } else {
                        Optional<User> userOptional = userRepository.findById(userId);
                        if (userOptional.isPresent() && userOptional.get().isActive()) {
                            User user = userOptional.get();
                            UserPrincipal principal = UserPrincipal.fromEntity(user);

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication in SecurityContext: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith(BEARER_PREFIX)) {
            return headerAuth.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
