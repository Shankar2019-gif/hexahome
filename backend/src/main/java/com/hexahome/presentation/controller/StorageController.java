package com.hexahome.presentation.controller;

import com.hexahome.application.dto.media.MediaResponseDto;
import com.hexahome.application.dto.media.PresignedUploadRequest;
import com.hexahome.application.dto.media.PresignedUploadResponseDto;
import com.hexahome.infrastructure.adapter.storage.StorageService;
import com.hexahome.presentation.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/storage")
@Tag(name = "Cloud Storage & Media", description = "Production AWS S3 presigned upload URLs, direct uploads, and asset purging")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/presigned-url")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Generate S3 presigned upload URL (JSON body)", description = "Generates a 10-minute S3 PUT presigned URL restricted strictly to image/jpeg, image/png, and image/webp")
    public ResponseEntity<ApiResponse<PresignedUploadResponseDto>> generatePresignedUrlPost(
            @Valid @RequestBody PresignedUploadRequest request) {
        PresignedUploadResponseDto response = storageService.generatePresignedUploadUrl(
                request.getFileName(),
                request.getContentType(),
                request.getPropertyId()
        );
        return ResponseEntity.ok(ApiResponse.success("Presigned upload URL generated successfully", response));
    }

    @GetMapping("/presigned-url")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Generate S3 presigned upload URL (Query params)", description = "Generates a 10-minute S3 PUT presigned URL restricted strictly to image/jpeg, image/png, and image/webp")
    public ResponseEntity<ApiResponse<PresignedUploadResponseDto>> generatePresignedUrlGet(
            @RequestParam("fileName") String fileName,
            @RequestParam("contentType") String contentType,
            @RequestParam(value = "propertyId", required = false) String propertyId) {
        PresignedUploadResponseDto response = storageService.generatePresignedUploadUrl(
                fileName,
                contentType,
                propertyId
        );
        return ResponseEntity.ok(ApiResponse.success("Presigned upload URL generated successfully", response));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Direct server-proxied image upload", description = "Validates max 5MB, strictly allowed image MIME types, sanitizes filename, and partitions key by propertyId")
    public ResponseEntity<ApiResponse<MediaResponseDto>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "propertyId", required = false) String propertyId) {
        MediaResponseDto response = storageService.uploadDirect(file, propertyId);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Purge asset from S3 storage", description = "Deletes asset from AWS S3 bucket by key or URL")
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @RequestParam("key") String key) {
        storageService.deleteFile(key);
        return ResponseEntity.ok(ApiResponse.success("Asset deleted successfully from S3 storage", null));
    }
}
