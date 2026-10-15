package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, UUID>, JpaSpecificationExecutor<AdminAuditLog> {

    Page<AdminAuditLog> findByEntityTypeOrderByCreatedAtDesc(String entityType, Pageable pageable);

    Page<AdminAuditLog> findByAdminIdOrderByCreatedAtDesc(UUID adminId, Pageable pageable);

    Page<AdminAuditLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);

    java.util.List<AdminAuditLog> findTop10ByOrderByCreatedAtDesc();

    java.util.List<AdminAuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, String entityId);
}
