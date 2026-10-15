package com.hexahome.application.dto.admin.content;

import jakarta.validation.constraints.NotBlank;

public class AdminPresignedUploadRequest {

    @NotBlank(message = "Filename is required")
    private String filename;

    @NotBlank(message = "Content type is required")
    private String contentType;

    private String category = "properties";

    public AdminPresignedUploadRequest() {
    }

    public AdminPresignedUploadRequest(String filename, String contentType, String category) {
        this.filename = filename;
        this.contentType = contentType;
        this.category = category;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
