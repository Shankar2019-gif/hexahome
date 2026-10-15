package com.hexahome.infrastructure.adapter.storage;

import com.hexahome.application.dto.media.MediaResponseDto;
import com.hexahome.application.dto.media.PresignedUploadResponseDto;
import com.hexahome.domain.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.MalformedURLException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AWS S3 Storage Service Unit Tests")
class StorageServiceTest {

    @Mock
    private S3Client s3Client;

    @Mock
    private S3Presigner s3Presigner;

    @Mock
    private PresignedPutObjectRequest presignedPutObjectRequest;

    private StorageService storageService;
    private final String bucketName = "hexahome-media-storage";
    private final String region = "ap-southeast-2";

    @BeforeEach
    void setUp() throws MalformedURLException {
        storageService = new StorageService(s3Client, s3Presigner, bucketName, region);
    }

    @Test
    @DisplayName("generatePresignedUploadUrl succeeds for allowed image MIME types with 10-minute expiry")
    void testGeneratePresignedUploadUrl_Success() throws MalformedURLException {
        when(presignedPutObjectRequest.url()).thenReturn(new URL("https://hexahome-media-storage.s3.ap-southeast-2.amazonaws.com/properties/prop-101/sample.jpg?X-Amz-Signature=test"));
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenReturn(presignedPutObjectRequest);

        PresignedUploadResponseDto response = storageService.generatePresignedUploadUrl("bedroom_photo.jpg", "image/jpeg", "prop-101");

        assertNotNull(response);
        assertEquals(10, response.getExpiresInMinutes());
        assertTrue(response.getKey().startsWith("properties/prop-101/"));
        assertTrue(response.getKey().endsWith(".jpg"));
        assertTrue(response.getUploadUrl().contains("X-Amz-Signature"));

        ArgumentCaptor<PutObjectPresignRequest> presignCaptor = ArgumentCaptor.forClass(PutObjectPresignRequest.class);
        verify(s3Presigner).presignPutObject(presignCaptor.capture());
        PutObjectPresignRequest captured = presignCaptor.getValue();
        assertEquals(10, captured.signatureDuration().toMinutes());
        assertEquals("image/jpeg", captured.putObjectRequest().contentType());
    }

    @Test
    @DisplayName("generatePresignedUploadUrl supports WEBP and PNG formats")
    void testGeneratePresignedUploadUrl_WebpAndPng() throws MalformedURLException {
        when(presignedPutObjectRequest.url()).thenReturn(new URL("https://s3.amazonaws.com/test"));
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenReturn(presignedPutObjectRequest);

        PresignedUploadResponseDto webpRes = storageService.generatePresignedUploadUrl("modern.webp", "image/webp");
        assertTrue(webpRes.getKey().endsWith(".webp"));

        PresignedUploadResponseDto pngRes = storageService.generatePresignedUploadUrl("floorplan.png", "image/png");
        assertTrue(pngRes.getKey().endsWith(".png"));
    }

    @Test
    @DisplayName("generatePresignedUploadUrl strictly rejects non-image MIME types")
    void testGeneratePresignedUploadUrl_RejectsNonImages() {
        assertThrows(BadRequestException.class, () ->
                storageService.generatePresignedUploadUrl("doc.pdf", "application/pdf"));

        assertThrows(BadRequestException.class, () ->
                storageService.generatePresignedUploadUrl("script.sh", "text/x-shellscript"));

        assertThrows(BadRequestException.class, () ->
                storageService.generatePresignedUploadUrl("animation.gif", "image/gif"));

        assertThrows(BadRequestException.class, () ->
                storageService.generatePresignedUploadUrl("photo.jpg", ""));
    }

    @Test
    @DisplayName("generatePresignedUploadUrl throws BadRequestException when filename is empty")
    void testGeneratePresignedUploadUrl_EmptyFilename() {
        assertThrows(BadRequestException.class, () ->
                storageService.generatePresignedUploadUrl("", "image/jpeg"));
    }

    @Test
    @DisplayName("uploadDirect rejects file exceeding 5MB limit")
    void testUploadDirect_RejectsFileOver5MB() {
        byte[] largeBytes = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeFile = new MockMultipartFile("file", "large.jpg", "image/jpeg", largeBytes);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                storageService.uploadDirect(largeFile, "prop-123"));

        assertTrue(ex.getMessage().contains("exceeds maximum allowed limit of 5MB"));
    }

    @Test
    @DisplayName("uploadDirect rejects empty file")
    void testUploadDirect_RejectsEmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.jpg", "image/jpeg", new byte[0]);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                storageService.uploadDirect(emptyFile, "prop-123"));

        assertTrue(ex.getMessage().contains("File cannot be empty"));
    }

    @Test
    @DisplayName("uploadDirect rejects non-image MIME types")
    void testUploadDirect_RejectsDisallowedMime() {
        MockMultipartFile pdfFile = new MockMultipartFile("file", "document.pdf", "application/pdf", "dummy content".getBytes());

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                storageService.uploadDirect(pdfFile, "prop-123"));

        assertTrue(ex.getMessage().contains("Allowed types are strictly: image/jpeg, image/png, image/webp"));
    }

    @Test
    @DisplayName("uploadDirect sanitizes path traversal characters in filename")
    void testUploadDirect_SanitizesPathTraversal() {
        String dangerousFilename = "../../../../../etc/passwd.jpg";
        String sanitized = storageService.sanitizeFilename(dangerousFilename);

        assertFalse(sanitized.contains(".."));
        assertFalse(sanitized.contains("/"));
        assertFalse(sanitized.contains("\\"));
        assertTrue(sanitized.contains("passwd.jpg"));
    }

    @Test
    @DisplayName("uploadDirect uploads image under 5MB to S3 and returns valid MediaResponseDto")
    void testUploadDirect_Success() {
        byte[] validImageBytes = "dummy image data".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "living_room.jpg", "image/jpeg", validImageBytes);

        MediaResponseDto response = storageService.uploadDirect(file, "prop-555");

        assertNotNull(response);
        assertEquals("image/jpeg", response.contentType());
        assertEquals("AWS_S3", response.storageProvider());
        assertTrue(response.url().contains("properties/prop-555/"));
        assertTrue(response.url().endsWith(".jpg"));

        verify(s3Client).putObject(any(software.amazon.awssdk.services.s3.model.PutObjectRequest.class),
                any(software.amazon.awssdk.core.sync.RequestBody.class));
    }

    @Test
    @DisplayName("deleteFile purges asset from S3 bucket")
    void testDeleteFile_PurgesS3Asset() {
        String fileUrl = "https://hexahome-media-storage.s3.ap-southeast-2.amazonaws.com/properties/prop-101/sample-photo.jpg";

        storageService.deleteFile(fileUrl);

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        DeleteObjectRequest request = captor.getValue();
        assertEquals("hexahome-media-storage", request.bucket());
        assertEquals("properties/prop-101/sample-photo.jpg", request.key());
    }

    @Test
    @DisplayName("deleteFile handles raw S3 key directly")
    void testDeleteFile_RawKey() {
        String key = "properties/prop-202/uuid-123.webp";

        storageService.deleteFile(key);

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals(key, captor.getValue().key());
    }

    @Test
    @DisplayName("buildPropertyObjectKey correctly partitions by property ID")
    void testBuildPropertyObjectKey() {
        String keyWithProp = storageService.buildPropertyObjectKey("prop-abc-123", ".jpg");
        assertTrue(keyWithProp.startsWith("properties/prop-abc-123/"));
        assertTrue(keyWithProp.endsWith(".jpg"));

        String keyWithoutProp = storageService.buildPropertyObjectKey(null, ".png");
        assertTrue(keyWithoutProp.startsWith("properties/general/"));
        assertTrue(keyWithoutProp.endsWith(".png"));
    }
}
