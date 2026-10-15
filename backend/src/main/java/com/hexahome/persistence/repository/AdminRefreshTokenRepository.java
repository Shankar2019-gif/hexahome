package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.AdminRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRefreshTokenRepository extends JpaRepository<AdminRefreshToken, UUID> {

    Optional<AdminRefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE AdminRefreshToken r SET r.isRevoked = true WHERE r.admin.id = :adminId")
    void revokeAllByAdminId(UUID adminId);

    @Modifying
    @Query("DELETE FROM AdminRefreshToken r WHERE r.expiresAt < :now OR r.isRevoked = true")
    void deleteExpiredOrRevoked(Instant now);
}
