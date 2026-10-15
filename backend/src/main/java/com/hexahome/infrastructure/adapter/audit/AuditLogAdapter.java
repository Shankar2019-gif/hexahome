package com.hexahome.infrastructure.adapter.audit;

import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.persistence.entity.AdminAuditLog;
import com.hexahome.persistence.entity.AdminUser;
import com.hexahome.persistence.repository.AdminAuditLogRepository;
import com.hexahome.persistence.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
public class AuditLogAdapter implements AuditLogPort {

    private static final Logger log = LoggerFactory.getLogger(AuditLogAdapter.class);

    private final AdminAuditLogRepository auditLogRepository;
    private final AdminUserRepository adminUserRepository;

    public AuditLogAdapter(
            AdminAuditLogRepository auditLogRepository,
            AdminUserRepository adminUserRepository) {
        this.auditLogRepository = auditLogRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public void recordAction(
            UUID adminId,
            String action,
            String entityType,
            String entityId,
            String previousValue,
            String newValue,
            String reason,
            String ipAddress,
            String outcome) {
        try {
            AdminUser admin = null;
            if (adminId != null) {
                admin = adminUserRepository.findById(adminId).orElse(null);
            }

            AdminAuditLog auditLog = new AdminAuditLog(
                    admin,
                    action,
                    entityType,
                    entityId,
                    sanitizeJson(previousValue),
                    sanitizeJson(newValue),
                    reason,
                    ipAddress,
                    outcome != null ? outcome : "SUCCESS"
            );

            auditLogRepository.save(auditLog);
            log.info("Recorded audit log: action={} entityType={} entityId={} adminId={}", action, entityType, entityId, adminId);
        } catch (Exception e) {
            log.error("Failed to record admin audit log: {}", e.getMessage(), e);
            throw e;
        }
    }

    private String sanitizeJson(String val) {
        if (val == null || val.isBlank()) {
            return null;
        }
        String trimmed = val.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
            return trimmed;
        }
        return "{\"value\":\"" + trimmed.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "") + "\"}";
    }
}
