package com.hexahome.application.service;

import com.hexahome.application.dto.admin.content.*;
import com.hexahome.application.port.out.AuditLogPort;
import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.infrastructure.adapter.storage.StorageService;
import com.hexahome.persistence.entity.City;
import com.hexahome.persistence.entity.Faq;
import com.hexahome.persistence.entity.Locality;
import com.hexahome.persistence.entity.Report;
import com.hexahome.persistence.repository.CityRepository;
import com.hexahome.persistence.repository.FaqRepository;
import com.hexahome.persistence.repository.LocalityRepository;
import com.hexahome.persistence.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminContentManagementServiceTest {

    @Mock
    private StorageService storageService;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private LocalityRepository localityRepository;

    @Mock
    private FaqRepository faqRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private AuditLogPort auditLogPort;

    private AdminContentManagementService contentService;

    private City testCity;
    private Locality testLocality;
    private Faq testFaq;
    private Report testReport;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        contentService = new AdminContentManagementService(
                storageService,
                cityRepository,
                localityRepository,
                faqRepository,
                reportRepository,
                auditLogPort
        );

        adminId = UUID.randomUUID();

        testCity = new City();
        testCity.setId(1);
        testCity.setName("Hyderabad");
        testCity.setState("Telangana");
        testCity.setSlug("hyderabad");
        testCity.setLatitude(new BigDecimal("17.3850"));
        testCity.setLongitude(new BigDecimal("78.4867"));
        testCity.setDisplayOrder(1);
        testCity.setActive(true);

        testLocality = new Locality();
        testLocality.setId(10);
        testLocality.setCity(testCity);
        testLocality.setName("Gachibowli");
        testLocality.setSlug("gachibowli");
        testLocality.setPinCode(500032);
        testLocality.setDisplayOrder(1);

        testFaq = new Faq("What is HexaHome?", "A verified zero-brokerage platform", "GENERAL", 1);
        testFaq.setId(100);

        testReport = new Report();
        testReport.setId(UUID.randomUUID());
        testReport.setReason("Inaccurate pricing");
        testReport.setComments("Advertised price is incorrect");
        testReport.setStatus("PENDING");
        testReport.setCreatedAt(Instant.now());
    }

    @Test
    void generatePresignedUploadUrl_Success() {
        AdminPresignedUploadRequest req = new AdminPresignedUploadRequest("hall.jpg", "image/jpeg", "properties");
        when(storageService.getPresignedUploadUrl(eq("hall.jpg"), eq("image/jpeg"), eq("properties"), any(Duration.class)))
                .thenReturn(Map.of(
                        "uploadUrl", "https://s3.ap-south-1.amazonaws.com/hexahome/properties/sample.jpg?signature=xyz",
                        "fileUrl", "https://cdn.hexahome.com/properties/sample.jpg",
                        "objectKey", "properties/sample.jpg"
                ));

        AdminPresignedUploadResponse res = contentService.generatePresignedUploadUrl(req, adminId, "127.0.0.1");

        assertNotNull(res);
        assertTrue(res.getUploadUrl().contains("signature=xyz"));
        assertEquals("properties/sample.jpg", res.getObjectKey());
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("PRESIGNED_UPLOAD_URL"),
                eq("MEDIA"),
                eq("properties/sample.jpg"),
                isNull(),
                eq("properties/sample.jpg"),
                eq("Presigned upload URL generated for hall.jpg"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void getAllCities_Success() {
        when(cityRepository.findAll(any(Sort.class))).thenReturn(List.of(testCity));

        List<AdminCityDto> cities = contentService.getAllCities();

        assertNotNull(cities);
        assertEquals(1, cities.size());
        assertEquals("Hyderabad", cities.get(0).getName());
    }

    @Test
    void createCity_Success() {
        CreateCityRequest req = new CreateCityRequest();
        req.setName("Bengaluru");
        req.setState("Karnataka");
        req.setSlug("bengaluru");
        req.setLatitude(new BigDecimal("12.9716"));
        req.setLongitude(new BigDecimal("77.5946"));

        when(cityRepository.findBySlug("bengaluru")).thenReturn(Optional.empty());
        City savedCity = new City();
        savedCity.setId(2);
        savedCity.setName("Bengaluru");
        savedCity.setState("Karnataka");
        savedCity.setSlug("bengaluru");
        when(cityRepository.save(any(City.class))).thenReturn(savedCity);

        AdminCityDto dto = contentService.createCity(req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals(2, dto.getId());
        assertEquals("Bengaluru", dto.getName());
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("CREATE_CITY"),
                eq("CITY"),
                eq("2"),
                isNull(),
                eq("Bengaluru"),
                eq("Created city Bengaluru"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void createCity_DuplicateSlug_ThrowsBadRequestException() {
        CreateCityRequest req = new CreateCityRequest();
        req.setSlug("hyderabad");
        when(cityRepository.findBySlug("hyderabad")).thenReturn(Optional.of(testCity));

        assertThrows(BadRequestException.class, () -> contentService.createCity(req, adminId, "127.0.0.1"));
        verify(cityRepository, never()).save(any());
    }

    @Test
    void updateCity_Success() {
        UpdateCityRequest req = new UpdateCityRequest();
        req.setName("Greater Hyderabad");
        req.setState("Telangana");
        req.setSlug("greater-hyderabad");
        when(cityRepository.findById(1)).thenReturn(Optional.of(testCity));
        when(cityRepository.save(any(City.class))).thenReturn(testCity);

        AdminCityDto dto = contentService.updateCity(1, req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals("Greater Hyderabad", testCity.getName());
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("UPDATE_CITY"),
                eq("CITY"),
                eq("1"),
                isNull(),
                eq("Greater Hyderabad"),
                eq("Updated city Greater Hyderabad"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void getLocalitiesByCity_Success() {
        when(localityRepository.findAllByCityIdOrderByDisplayOrderAsc(1)).thenReturn(List.of(testLocality));

        List<AdminLocalityDto> localities = contentService.getLocalitiesByCity(1);

        assertNotNull(localities);
        assertEquals(1, localities.size());
        assertEquals("Gachibowli", localities.get(0).getName());
    }

    @Test
    void createLocality_Success() {
        CreateLocalityRequest req = new CreateLocalityRequest();
        req.setCityId(1);
        req.setName("Madhapur");
        req.setSlug("madhapur");
        req.setPinCode(500081);

        when(cityRepository.findById(1)).thenReturn(Optional.of(testCity));
        when(localityRepository.findByCityIdAndSlug(1, "madhapur")).thenReturn(Optional.empty());

        Locality savedLocality = new Locality();
        savedLocality.setId(11);
        savedLocality.setCity(testCity);
        savedLocality.setName("Madhapur");
        savedLocality.setSlug("madhapur");
        when(localityRepository.save(any(Locality.class))).thenReturn(savedLocality);

        AdminLocalityDto dto = contentService.createLocality(req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals(11, dto.getId());
        assertEquals("Madhapur", dto.getName());
    }

    @Test
    void getAllFaqs_Success() {
        when(faqRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(List.of(testFaq));

        List<AdminFaqDto> faqs = contentService.getAllFaqs();

        assertNotNull(faqs);
        assertEquals(1, faqs.size());
        assertEquals("What is HexaHome?", faqs.get(0).getQuestion());
    }

    @Test
    void createFaq_Success() {
        CreateFaqRequest req = new CreateFaqRequest();
        req.setQuestion("How do I contact an owner?");
        req.setAnswer("Use verified contact button.");
        req.setCategory("TENANT");

        Faq savedFaq = new Faq();
        savedFaq.setId(101);
        savedFaq.setQuestion("How do I contact an owner?");
        savedFaq.setAnswer("Use verified contact button.");
        savedFaq.setCategory("TENANT");
        when(faqRepository.save(any(Faq.class))).thenReturn(savedFaq);

        AdminFaqDto dto = contentService.createFaq(req, adminId, "127.0.0.1");

        assertNotNull(dto);
        assertEquals(101, dto.getId());
    }

    @Test
    void deleteFaq_Success() {
        when(faqRepository.findById(100)).thenReturn(Optional.of(testFaq));

        contentService.deleteFaq(100, adminId, "127.0.0.1");

        verify(faqRepository).delete(testFaq);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("DELETE_FAQ"),
                eq("FAQ"),
                eq("100"),
                eq("What is HexaHome?"),
                isNull(),
                eq("Deleted FAQ"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void searchReports_Success() {
        AdminReportFilterRequest filter = new AdminReportFilterRequest();
        filter.setPage(0);
        filter.setSize(10);

        Page<Report> reportPage = new PageImpl<>(List.of(testReport));
        when(reportRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(reportPage);

        Page<AdminReportSummaryDto> results = contentService.searchReports(filter);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals("Inaccurate pricing", results.getContent().get(0).getReason());
    }

    @Test
    void updateReportStatus_Success() {
        UpdateReportStatusRequest req = new UpdateReportStatusRequest("RESOLVED", "Listing price was corrected");
        UUID reportId = testReport.getId();
        when(reportRepository.findById(reportId)).thenReturn(Optional.of(testReport));

        contentService.updateReportStatus(reportId, req, adminId, "127.0.0.1");

        assertEquals("RESOLVED", testReport.getStatus());
        verify(reportRepository).save(testReport);
        verify(auditLogPort).recordAction(
                eq(adminId),
                eq("UPDATE_REPORT_STATUS"),
                eq("REPORT"),
                eq(reportId.toString()),
                eq("PENDING"),
                eq("RESOLVED"),
                eq("Listing price was corrected"),
                eq("127.0.0.1"),
                eq("SUCCESS")
        );
    }

    @Test
    void updateReportStatus_InvalidStatus_ThrowsBadRequestException() {
        UpdateReportStatusRequest req = new UpdateReportStatusRequest("INVALID_STATUS", "Invalid");
        UUID reportId = testReport.getId();
        when(reportRepository.findById(reportId)).thenReturn(Optional.of(testReport));

        assertThrows(BadRequestException.class, () -> contentService.updateReportStatus(reportId, req, adminId, "127.0.0.1"));
        verify(reportRepository, never()).save(any());
    }
}
