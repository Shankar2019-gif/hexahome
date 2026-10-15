package com.hexahome.infrastructure.security;

import com.hexahome.persistence.entity.AdminUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class AdminPrincipal implements UserDetails {

    private final UUID id;
    private final String username;
    private final String email;
    private final String fullName;
    private final String role;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public AdminPrincipal(
            UUID id,
            String username,
            String email,
            String fullName,
            String role,
            boolean active,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.active = active;
        this.authorities = authorities;
    }

    public static AdminPrincipal fromEntity(AdminUser adminUser) {
        String roleName = adminUser.getRole();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }
        GrantedAuthority authority = new SimpleGrantedAuthority(roleName);

        return new AdminPrincipal(
                adminUser.getId(),
                adminUser.getUsername(),
                adminUser.getEmail(),
                adminUser.getFullName(),
                adminUser.getRole(),
                adminUser.isActive(),
                Collections.singletonList(authority)
        );
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
