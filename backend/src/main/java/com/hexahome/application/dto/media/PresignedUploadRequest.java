package com.hexahome.application.dto.media;

import jakarta.validation.constraints.NotBlank;

public class PresignedUploadRequest {

    @NotBlank(message = "fileName is required")
    private String fileName;

    @NotBlank(message = "contentType is required")
    private String contentType;

    private String propertyId;

    public PresignedUploadRequest() {
    }

    public PresignedUploadRequest(String fileName, String contentType) {
        this.fileName = fileName;
        this.contentType = contentType;
    }

    public PresignedUploadRequest(String fileName, String contentType, String propertyId) {
        this.fileName = fileName;
        this.contentType = contentType;
        this.propertyId = propertyId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }
}
