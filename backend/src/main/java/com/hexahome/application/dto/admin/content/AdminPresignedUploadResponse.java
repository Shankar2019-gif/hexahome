package com.hexahome.application.dto.admin.content;

import java.time.Instant;

public class AdminPresignedUploadResponse {

    private String uploadUrl;
    private String fileUrl;
    private String objectKey;
    private Instant expiresAt;

    public AdminPresignedUploadResponse() {
    }

    public AdminPresignedUploadResponse(String uploadUrl, String fileUrl, String objectKey, Instant expiresAt) {
        this.uploadUrl = uploadUrl;
        this.fileUrl = fileUrl;
        this.objectKey = objectKey;
        this.expiresAt = expiresAt;
    }

    public String getUploadUrl() {
        return uploadUrl;
    }

    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
