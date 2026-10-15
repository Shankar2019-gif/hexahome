package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Application and database health monitoring endpoints")
public class HealthController {

    private final DataSource dataSource;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    @Operation(summary = "System health check", description = "Returns system operational status, active profile, and database connectivity check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> healthInfo = new LinkedHashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("profile", activeProfile);
        healthInfo.put("version", "1.0.0");
        healthInfo.put("timestamp", Instant.now().toString());

        boolean dbOk = false;
        try (Connection conn = dataSource.getConnection()) {
            dbOk = conn.isValid(2);
            healthInfo.put("database", dbOk ? "CONNECTED" : "UNAVAILABLE");
        } catch (Exception e) {
            healthInfo.put("database", "DISCONNECTED: " + e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.success("HexaHome backend is healthy", healthInfo));
    }
}
