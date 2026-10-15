package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, UUID>, JpaSpecificationExecutor<AdminUser> {

    Optional<AdminUser> findByUsername(String username);

    Optional<AdminUser> findByEmail(String email);

    Optional<AdminUser> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    long countByRole(String role);
}
