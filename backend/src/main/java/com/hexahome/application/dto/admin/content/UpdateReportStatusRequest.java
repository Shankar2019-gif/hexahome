package com.hexahome.application.dto.admin.content;

import jakarta.validation.constraints.NotBlank;

public class UpdateReportStatusRequest {

    @NotBlank(message = "Status is required (e.g. REVIEWED, RESOLVED, DISMISSED)")
    private String status;

    private String comments;

    public UpdateReportStatusRequest() {
    }

    public UpdateReportStatusRequest(String status, String comments) {
        this.status = status;
        this.comments = comments;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
