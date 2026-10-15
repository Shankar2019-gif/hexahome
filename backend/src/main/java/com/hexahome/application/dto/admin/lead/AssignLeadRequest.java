package com.hexahome.application.dto.admin.lead;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AssignLeadRequest {

    @NotNull(message = "Assigned admin ID is mandatory")
    private UUID adminId;

    private String notes;

    public AssignLeadRequest() {
    }

    public AssignLeadRequest(UUID adminId, String notes) {
        this.adminId = adminId;
        this.notes = notes;
    }

    public UUID getAdminId() {
        return adminId;
    }

    public void setAdminId(UUID adminId) {
        this.adminId = adminId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
