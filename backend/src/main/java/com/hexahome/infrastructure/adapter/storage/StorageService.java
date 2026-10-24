package com.hexahome.infrastructure.adapter.storage;

import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.application.dto.media.MediaResponseDto;
import com.hexahome.application.dto.media.PresignedUploadResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.client.config.ClientOverrideConfiguration;
import software.amazon.awssdk.core.retry.RetryPolicy;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

/**
 * Production AWS S3 Cloud Storage Service.
 * Implements S3 Presigned URL generation (10 min expiry, strict image MIME validation),
 * server-side direct uploads (5MB image limit, filename sanitization, property ID partitioning),
 * and object purging.
 */
@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    // Max file size for direct uploads: 5MB per image
    public static final long MAX_DIRECT_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    // Presigned upload expiry: strictly 10 minutes
    public static final Duration PRESIGNED_UPLOAD_EXPIRY = Duration.ofMinutes(10);
    public static final Duration DEFAULT_DOWNLOAD_DURATION = Duration.ofMinutes(15);

    // Strictly allowed image MIME types
    public static final Set<String> ALLOWED_IMAGE_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    public static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final String bucketName;
    private final String region;
    private final String cloudfrontDomain;
    private final Path localFallbackDir;
    private final String localBaseUrl;

    private S3Client s3Client;
    private S3Presigner s3Presigner;
    private volatile boolean s3Configured = false;
    private final java.util.concurrent.atomic.AtomicInteger s3ConsecutiveFailures = new java.util.concurrent.atomic.AtomicInteger(0);

    @Autowired
    public StorageService(
            @Value("${aws.s3.bucket-name:${hexahome.aws.s3-bucket:${AWS_S3_BUCKET_NAME:}}}") String bucketName,
            @Value("${aws.region:${hexahome.aws.region:${AWS_REGION:ap-south-1}}}") String region,
            @Value("${aws.access-key-id:${hexahome.aws.access-key-id:${AWS_ACCESS_KEY_ID:}}}") String accessKey,
            @Value("${aws.secret-access-key:${hexahome.aws.secret-access-key:${AWS_SECRET_ACCESS_KEY:}}}") String secretKey,
            @Value("${aws.cloudfront-domain:${hexahome.aws.cloudfront-domain:${CLOUDFRONT_DOMAIN:}}}") String cloudfrontDomain,
            @Value("${hexahome.storage.local-dir:uploads}") String localDir,
            @Value("${hexahome.storage.base-url:http://localhost:8081/uploads}") String localBaseUrl) {

        this.bucketName = StringUtils.hasText(bucketName) ? bucketName.trim() : null;
        this.region = StringUtils.hasText(region) ? region.trim() : "ap-south-1";
        this.cloudfrontDomain = StringUtils.hasText(cloudfrontDomain) ? cloudfrontDomain.trim().replaceAll("/+$", "") : null;
        this.localFallbackDir = Paths.get(localDir).toAbsolutePath().normalize();
        this.localBaseUrl = localBaseUrl.replaceAll("/+$", "");

        initS3(accessKey, secretKey);
        initLocalDir();
    }

    // Testing / mocking constructor
    public StorageService(
            S3Client s3Client,
            S3Presigner s3Presigner,
            String bucketName,
            String region) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.bucketName = bucketName;
        this.region = region != null ? region : "ap-south-1";
        this.cloudfrontDomain = null;
        this.localFallbackDir = Paths.get("uploads").toAbsolutePath().normalize();
        this.localBaseUrl = "http://localhost:8081/uploads";
        this.s3Configured = (s3Client != null && s3Presigner != null && StringUtils.hasText(bucketName));
    }

    private void initS3(String accessKey, String secretKey) {
        if (!StringUtils.hasText(bucketName) || !StringUtils.hasText(accessKey) || !StringUtils.hasText(secretKey)) {
            log.info("AWS S3 not fully configured. Using local filesystem storage: {}", localFallbackDir);
            return;
        }

        try {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey.trim(), secretKey.trim());
            StaticCredentialsProvider provider = StaticCredentialsProvider.create(credentials);
            Region awsRegion = Region.of(this.region);

            // Bounded timeouts to prevent socket stalls and client timeout errors
            ClientOverrideConfiguration clientOverrideConfig = ClientOverrideConfiguration.builder()
                    .apiCallAttemptTimeout(Duration.ofSeconds(4))
                    .apiCallTimeout(Duration.ofSeconds(8))
                    .retryPolicy(RetryPolicy.none())
                    .build();

            this.s3Client = S3Client.builder()
                    .region(awsRegion)
                    .credentialsProvider(provider)
                    .overrideConfiguration(clientOverrideConfig)
                    .build();

            this.s3Presigner = S3Presigner.builder()
                    .region(awsRegion)
                    .credentialsProvider(provider)
                    .build();

            this.s3Configured = true;
            log.info("AWS S3 storage initialized for bucket: '{}' [{}]", bucketName, this.region);
        } catch (Exception e) {
            log.warn("S3 client init failed ({}). Falling back to local storage.", e.getMessage());
            this.s3Configured = false;
        }
    }

    private void initLocalDir() {
        try {
            Files.createDirectories(localFallbackDir);
            Files.createDirectories(localFallbackDir.resolve("properties"));
            Files.createDirectories(localFallbackDir.resolve("properties/general"));
        } catch (IOException e) {
            log.error("Could not initialize local storage directory: {}", e.getMessage());
        }
    }

    // =========================================================================
    // 1. Presigned Upload URLs (AWS SDK v2 S3Presigner, 10 min, Image MIME only)
    // =========================================================================

    /**
     * Generates an AWS S3 presigned PUT URL with 10-minute validity.
     * Restricts MIME types strictly to image/jpeg, image/png, and image/webp.
     */
    public PresignedUploadResponseDto generatePresignedUploadUrl(String fileName, String contentType) {
        return generatePresignedUploadUrl(fileName, contentType, null);
    }

    /**
     * Generates an AWS S3 presigned PUT URL partitioned by property ID.
     */
    public PresignedUploadResponseDto generatePresignedUploadUrl(String fileName, String contentType, String propertyId) {
        if (!StringUtils.hasText(fileName)) {
            throw new BadRequestException("Filename is required for presigned upload");
        }

        String cleanContentType = validateAndNormalizeImageContentType(contentType);
        String extension = IMAGE_EXTENSIONS.get(cleanContentType);
        String partitionedKey = buildPropertyObjectKey(propertyId, extension);

        String uploadUrl;
        String finalFileUrl;

        if (s3Configured && s3Presigner != null) {
            try {
                PutObjectRequest putRequest = PutObjectRequest.builder()
                        .bucket(this.bucketName)
                        .key(partitionedKey)
                        .contentType(cleanContentType)
                        .build();

                PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                        .signatureDuration(PRESIGNED_UPLOAD_EXPIRY)
                        .putObjectRequest(putRequest)
                        .build();

                PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
                uploadUrl = presigned.url().toString();
                finalFileUrl = resolvePublicUrl(partitionedKey);
                log.info("Generated S3 presigned upload URL for key: {}", partitionedKey);
            } catch (S3Exception e) {
                log.error("S3 error generating presigned upload URL for key '{}': {}", partitionedKey, e.awsErrorDetails().errorMessage());
                throw new BadRequestException("Could not generate S3 presigned upload URL: " + e.awsErrorDetails().errorMessage());
            }
        } else {
            uploadUrl = localBaseUrl + "/direct-upload?key=" + partitionedKey;
            finalFileUrl = localBaseUrl + "/" + partitionedKey;
            log.info("S3 not configured. Generated local fallback upload URL for key: {}", partitionedKey);
        }

        return new PresignedUploadResponseDto(
                uploadUrl,
                finalFileUrl,
                partitionedKey,
                (int) PRESIGNED_UPLOAD_EXPIRY.toMinutes()
        );
    }

    /**
     * Backward-compatible helper returning a Map for existing callers.
     */
    public Map<String, String> getPresignedUploadUrl(String filename, String contentType, String category, Duration duration) {
        PresignedUploadResponseDto dto = generatePresignedUploadUrl(filename, contentType, category);
        return Map.of(
                "uploadUrl", dto.getUploadUrl(),
                "fileUrl", dto.getFileUrl(),
                "objectKey", dto.getKey()
        );
    }

    // =========================================================================
    // 2. Direct Upload Fallback (Max 5MB, Filename Sanitization, Partitioning)
    // =========================================================================

    /**
     * Server-side upload handler with 5MB validation, path traversal defense,
     * and property ID key partitioning (properties/{propertyId}/{uuid}.{ext}).
     */
    public MediaResponseDto uploadDirect(MultipartFile file, String propertyId) {
        validateDirectImageFile(file);

        String cleanContentType = validateAndNormalizeImageContentType(file.getContentType());
        String extension = IMAGE_EXTENSIONS.get(cleanContentType);
        String objectKey = buildPropertyObjectKey(propertyId, extension);
        long size = file.getSize();

        // Sanitize original filename to prevent path traversal
        String sanitizedFilename = sanitizeFilename(file.getOriginalFilename());

        String fileUrl;
        String provider;
        if (s3Configured && s3Client != null) {
            try {
                fileUrl = uploadToS3(file, objectKey, cleanContentType);
                provider = "AWS_S3";
                s3ConsecutiveFailures.set(0);
            } catch (Exception e) {
                handleS3Failure(e);
                log.warn("S3 upload failed ({}). Falling back to local storage.", e.getMessage());
                fileUrl = uploadToLocal(file, objectKey);
                provider = "LOCAL_DISK";
            }
        } else {
            fileUrl = uploadToLocal(file, objectKey);
            provider = "LOCAL_DISK";
        }

        return new MediaResponseDto(
                UUID.randomUUID(),
                sanitizedFilename,
                fileUrl,
                cleanContentType,
                size,
                provider,
                Instant.now()
        );
    }

    private void handleS3Failure(Exception e) {
        int failures = s3ConsecutiveFailures.incrementAndGet();
        Throwable cause = e;
        while (cause != null) {
            if (cause instanceof S3Exception s3e) {
                int status = s3e.statusCode();
                if (status == 403 || status == 401 || status == 400) {
                    log.warn("AWS S3 permission/configuration error (HTTP {}): Disabling S3 provider and switching permanently to local storage fallback.", status);
                    this.s3Configured = false;
                    return;
                }
            }
            cause = cause.getCause();
        }
        if (failures >= 2) {
            log.warn("AWS S3 reached failure threshold ({} consecutive failures). Disabling S3 provider and switching to local storage fallback.", failures);
            this.s3Configured = false;
        }
    }

    /**
     * Compatibility wrapper for existing multipart callers.
     */
    public MediaResponseDto upload(MultipartFile file, String category) {
        return uploadDirect(file, category);
    }

    public List<MediaResponseDto> uploadBatch(List<MultipartFile> files, String propertyId) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("At least one file must be provided for upload");
        }

        return files.parallelStream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> uploadDirect(file, propertyId))
                .toList();
    }

    // =========================================================================
    // 3. Deletion (Purge asset from S3 bucket)
    // =========================================================================

    /**
     * Purges asset from the AWS S3 bucket when a listing or photo is removed.
     * Accepts either a raw S3 object key or a full public/CDN URL.
     */
    public void deleteFile(String keyOrUrl) {
        if (!StringUtils.hasText(keyOrUrl)) {
            return;
        }

        String objectKey = extractObjectKey(keyOrUrl);
        if (!StringUtils.hasText(objectKey)) {
            return;
        }

        if (s3Configured && s3Client != null) {
            try {
                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(this.bucketName)
                        .key(objectKey)
                        .build();
                s3Client.deleteObject(deleteRequest);
                log.info("Purged asset from AWS S3 bucket '{}': key={}", this.bucketName, objectKey);
            } catch (S3Exception e) {
                log.warn("S3 deletion failed for key '{}': {}. Attempting local cleanup.", objectKey, e.awsErrorDetails().errorMessage());
            }
        }

        // Clean up from local fallback storage if present
        deleteFromLocal(objectKey);
    }

    /**
     * Legacy alias for deleteFile.
     */
    public void delete(String fileUrlOrKey) {
        deleteFile(fileUrlOrKey);
    }

    // =========================================================================
    // Presigned Download & Helpers
    // =========================================================================

    public String getPresignedDownloadUrl(String fileUrlOrKey, Duration duration) {
        if (!s3Configured || s3Presigner == null) {
            return fileUrlOrKey;
        }

        String objectKey = extractObjectKey(fileUrlOrKey);
        if (!StringUtils.hasText(objectKey)) {
            throw new BadRequestException("Invalid object key or URL");
        }

        Duration ttl = (duration != null && !duration.isNegative() && !duration.isZero())
                ? duration
                : DEFAULT_DOWNLOAD_DURATION;

        try {
            GetObjectRequest getRequest = GetObjectRequest.builder()
                    .bucket(this.bucketName)
                    .key(objectKey)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(ttl)
                    .getObjectRequest(getRequest)
                    .build();

            PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(presignRequest);
            return presigned.url().toString();
        } catch (S3Exception e) {
            log.error("S3 error generating presigned download URL for key '{}': {}", objectKey, e.awsErrorDetails().errorMessage());
            throw new BadRequestException("Could not generate presigned download URL: " + e.awsErrorDetails().errorMessage());
        }
    }

    private void validateDirectImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        if (file.getSize() > MAX_DIRECT_FILE_SIZE) {
            throw new BadRequestException("File size (" + file.getSize() + " bytes) exceeds maximum allowed limit of 5MB per image.");
        }

        validateAndNormalizeImageContentType(file.getContentType());
    }

    private String validateAndNormalizeImageContentType(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            throw new BadRequestException("Content-Type is required and cannot be empty");
        }

        String cleanType = contentType.trim().toLowerCase();
        if (!ALLOWED_IMAGE_MIME_TYPES.contains(cleanType)) {
            throw new BadRequestException("Unsupported media type: '" + contentType + "'. Allowed types are strictly: image/jpeg, image/png, image/webp.");
        }
        return cleanType;
    }

    /**
     * Sanitizes original filename to prevent directory traversal and path manipulation attacks.
     */
    public String sanitizeFilename(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "image_" + UUID.randomUUID().toString().substring(0, 8);
        }

        // Extract filename without path separators
        String nameOnly = Paths.get(filename).getFileName().toString();
        // Remove null bytes, control characters, and dangerous symbols
        String sanitized = nameOnly.replaceAll("[^a-zA-Z0-9._-]", "_");
        // Prevent leading dots or empty result
        sanitized = sanitized.replaceAll("^\\.+", "");
        return StringUtils.hasText(sanitized) ? sanitized : "image_" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Partitions keys by property ID: properties/{propertyId}/{uuid}.{ext}
     */
    public String buildPropertyObjectKey(String propertyId, String extension) {
        String propFolder = "general";
        if (StringUtils.hasText(propertyId)) {
            // Sanitize property ID to alphanumeric / dashes / underscores only
            String sanitizedPropId = propertyId.trim().replaceAll("[^a-zA-Z0-9_-]", "");
            if (StringUtils.hasText(sanitizedPropId)) {
                propFolder = sanitizedPropId;
            }
        }
        return String.format("properties/%s/%s%s", propFolder, UUID.randomUUID(), extension);
    }

    private String resolvePublicUrl(String objectKey) {
        if (StringUtils.hasText(cloudfrontDomain)) {
            return cloudfrontDomain + "/" + objectKey;
        }
        return String.format("https://%s.s3.%s.amazonaws.com/%s", this.bucketName, this.region, objectKey);
    }

    private String uploadToS3(MultipartFile file, String objectKey, String contentType) {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(this.bucketName)
                    .key(objectKey)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            log.info("Uploaded asset to AWS S3: key={}", objectKey);
            return resolvePublicUrl(objectKey);
        } catch (S3Exception e) {
            log.error("S3 upload failed for key '{}': {}", objectKey, e.awsErrorDetails().errorMessage());
            throw new BadRequestException("S3 upload failed: " + e.awsErrorDetails().errorMessage());
        } catch (IOException e) {
            log.error("Failed to read file payload: {}", e.getMessage());
            throw new BadRequestException("Failed to read file data");
        }
    }

    private String uploadToLocal(MultipartFile file, String objectKey) {
        try {
            Path targetPath = localFallbackDir.resolve(objectKey).normalize();
            if (!targetPath.startsWith(localFallbackDir)) {
                throw new BadRequestException("Path traversal attempt detected");
            }
            Files.createDirectories(targetPath.getParent());
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
            return localBaseUrl + "/" + objectKey;
        } catch (IOException e) {
            log.error("Failed to write local file: {}", e.getMessage());
            throw new BadRequestException("Failed to store file on local disk");
        }
    }

    private void deleteFromLocal(String fileUrlOrKey) {
        String objectKey = extractObjectKey(fileUrlOrKey);
        if (!StringUtils.hasText(objectKey)) {
            return;
        }
        try {
            Path targetPath = localFallbackDir.resolve(objectKey).normalize();
            if (targetPath.startsWith(localFallbackDir)) {
                Files.deleteIfExists(targetPath);
                log.info("Deleted local file: {}", targetPath);
            }
        } catch (IOException e) {
            log.warn("Local deletion failed for key '{}': {}", objectKey, e.getMessage());
        }
    }

    public String extractObjectKey(String urlOrKey) {
        if (!StringUtils.hasText(urlOrKey)) {
            return null;
        }
        String clean = urlOrKey.trim();
        if (clean.contains(".amazonaws.com/")) {
            return clean.substring(clean.indexOf(".amazonaws.com/") + 15);
        }
        if (StringUtils.hasText(cloudfrontDomain) && clean.startsWith(cloudfrontDomain)) {
            return clean.substring(cloudfrontDomain.length()).replaceAll("^/+", "");
        }
        if (clean.contains("/uploads/")) {
            return clean.substring(clean.indexOf("/uploads/") + 9);
        }
        return clean.replaceAll("^/+", "");
    }

    public boolean isS3Configured() {
        return s3Configured;
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getRegion() {
        return region;
    }
}
