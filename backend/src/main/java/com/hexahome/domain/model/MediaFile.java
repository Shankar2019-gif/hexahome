package com.hexahome.domain.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Onion Architecture Core Domain Model: MediaFile
 * Represents an uploaded media asset free of any JPA/database annotations.
 */
public class MediaFile {

    private final UUID id;
    private final String fileName;
    private final String url;
    private final String contentType;
    private final long sizeBytes;
    private final String storageProvider;
    private final Instant uploadedAt;

    public MediaFile(UUID id, String fileName, String url, String contentType, long sizeBytes, String storageProvider, Instant uploadedAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.fileName = fileName;
        this.url = url;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.storageProvider = storageProvider;
        this.uploadedAt = uploadedAt != null ? uploadedAt : Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getUrl() {
        return url;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public String getStorageProvider() {
        return storageProvider;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
