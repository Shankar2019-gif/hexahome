package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.media.MediaResponseDto;
import com.hexahome.infrastructure.adapter.storage.StorageService;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.repository.PropertyImageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/media")
@Tag(name = "Media Storage", description = "Media file uploads and secure download access")
public class MediaController {

    private final StorageService storageService;
    private final PropertyImageRepository propertyImageRepository;

    public MediaController(
            StorageService storageService,
            PropertyImageRepository propertyImageRepository) {
        this.storageService = storageService;
        this.propertyImageRepository = propertyImageRepository;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload single media file")
    public ResponseEntity<ApiResponse<MediaResponseDto>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "properties") String category) {
        MediaResponseDto response = storageService.upload(file, category);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload multiple media files")
    public ResponseEntity<ApiResponse<List<MediaResponseDto>>> uploadMultipleFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "category", defaultValue = "properties") String category) {
        List<MediaResponseDto> response = storageService.uploadBatch(files, category);
        return ResponseEntity.ok(ApiResponse.success("Files uploaded successfully", response));
    }

    @GetMapping("/presigned-url")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get temporary presigned download URL")
    public ResponseEntity<ApiResponse<String>> getPresignedUrl(
            @RequestParam("key") String fileUrlOrKey,
            @RequestParam(value = "minutes", defaultValue = "15") int minutes) {
        String presignedUrl = storageService.getPresignedDownloadUrl(fileUrlOrKey, Duration.ofMinutes(minutes));
        return ResponseEntity.ok(ApiResponse.success("Presigned URL generated successfully", presignedUrl));
    }

    @DeleteMapping
    @PreAuthorize("@securityEvaluator.canDeleteMedia(#url, authentication)")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete media file (Owner or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@RequestParam("url") String url) {
        propertyImageRepository.findAllByImageUrlOrThumbnailUrl(url, url).forEach(img -> {
            Property prop = img.getProperty();
            if (prop != null && prop.getImages() != null) {
                prop.getImages().remove(img);
            }
            propertyImageRepository.delete(img);
        });
        storageService.delete(url);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }
}
