package com.hexahome.application.dto.media;

public class PresignedUploadResponseDto {

    private String uploadUrl;
    private String fileUrl;
    private String key;
    private int expiresInMinutes;

    public PresignedUploadResponseDto() {
    }

    public PresignedUploadResponseDto(String uploadUrl, String fileUrl, String key, int expiresInMinutes) {
        this.uploadUrl = uploadUrl;
        this.fileUrl = fileUrl;
        this.key = key;
        this.expiresInMinutes = expiresInMinutes;
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

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getExpiresInMinutes() {
        return expiresInMinutes;
    }

    public void setExpiresInMinutes(int expiresInMinutes) {
        this.expiresInMinutes = expiresInMinutes;
    }
}
