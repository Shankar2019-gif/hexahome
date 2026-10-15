package com.hexahome.application.dto.user;

import com.hexahome.persistence.entity.Role;
import com.hexahome.persistence.entity.User;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserDto {

    private UUID id;
    private String phone;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePicUrl;
    private boolean isVerified;
    private Set<String> roles;

    public UserDto() {
    }

    public UserDto(UUID id, String phone, String email, String name, String firstName, String lastName, String role, String profilePicUrl, boolean isVerified, Set<String> roles) {
        this.id = id;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.profilePicUrl = profilePicUrl;
        this.isVerified = isVerified;
        this.roles = roles;
    }

    public static UserDto fromEntity(User user) {
        if (user == null) {
            return null;
        }
        Set<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                : Set.of();

        String primaryRole = roleNames.stream()
                .findFirst()
                .map(r -> r.replace("ROLE_", ""))
                .orElse("INDIVIDUAL");

        String fName = user.getFirstName();
        String lName = user.getLastName();
        if ((fName == null || fName.isBlank()) && user.getName() != null) {
            String[] parts = user.getName().trim().split("\\s+", 2);
            fName = parts[0];
            lName = parts.length > 1 ? parts[1] : "";
        }

        return new UserDto(
                user.getId(),
                user.getPhone(),
                user.getEmail(),
                user.getName(),
                fName,
                lName,
                primaryRole,
                user.getProfilePicUrl(),
                user.isVerified(),
                roleNames
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfilePicUrl() {
        return profilePicUrl;
    }

    public void setProfilePicUrl(String profilePicUrl) {
        this.profilePicUrl = profilePicUrl;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
