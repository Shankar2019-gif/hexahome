package com.hexahome.application.dto.media;

import com.hexahome.domain.model.MediaFile;

import java.time.Instant;
import java.util.UUID;

public record MediaResponseDto(
        UUID id,
        String fileName,
        String url,
        String contentType,
        long sizeBytes,
        String storageProvider,
        Instant uploadedAt
) {
    public static MediaResponseDto fromDomain(MediaFile domain) {
        return new MediaResponseDto(
                domain.getId(),
                domain.getFileName(),
                domain.getUrl(),
                domain.getContentType(),
                domain.getSizeBytes(),
                domain.getStorageProvider(),
                domain.getUploadedAt()
        );
    }
}
