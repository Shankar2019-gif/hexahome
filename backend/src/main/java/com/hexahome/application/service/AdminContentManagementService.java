package com.hexahome.application.service;

import com.hexahome.application.dto.admin.content.*;
import com.hexahome.application.port.in.AdminContentManagementUseCase;
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
import com.hexahome.persistence.specification.AdminReportSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminContentManagementService implements AdminContentManagementUseCase {

    private static final Logger log = LoggerFactory.getLogger(AdminContentManagementService.class);
    private static final Set<String> ALLOWED_REPORT_SORT = Set.of("createdAt", "status");
    private static final Set<String> VALID_REPORT_STATUSES = Set.of("PENDING", "REVIEWED", "RESOLVED", "DISMISSED");

    private final StorageService storageService;
    private final CityRepository cityRepository;
    private final LocalityRepository localityRepository;
    private final FaqRepository faqRepository;
    private final ReportRepository reportRepository;
    private final AuditLogPort auditLogPort;

    public AdminContentManagementService(
            StorageService storageService,
            CityRepository cityRepository,
            LocalityRepository localityRepository,
            FaqRepository faqRepository,
            ReportRepository reportRepository,
            AuditLogPort auditLogPort) {
        this.storageService = storageService;
        this.cityRepository = cityRepository;
        this.localityRepository = localityRepository;
        this.faqRepository = faqRepository;
        this.reportRepository = reportRepository;
        this.auditLogPort = auditLogPort;
    }

    @Override
    @Transactional
    public AdminPresignedUploadResponse generatePresignedUploadUrl(AdminPresignedUploadRequest request, UUID adminId, String ipAddress) {
        Duration duration = Duration.ofMinutes(15);
        Map<String, String> presigned = storageService.getPresignedUploadUrl(
                request.getFilename(),
                request.getContentType(),
                request.getCategory(),
                duration
        );

        String objectKey = presigned.get("objectKey");

        auditLogPort.recordAction(
                adminId,
                "PRESIGNED_UPLOAD_URL",
                "MEDIA",
                objectKey,
                null,
                objectKey,
                "Presigned upload URL generated for " + request.getFilename(),
                ipAddress,
                "SUCCESS"
        );

        return new AdminPresignedUploadResponse(
                presigned.get("uploadUrl"),
                presigned.get("fileUrl"),
                objectKey,
                Instant.now().plus(duration)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminCityDto> getAllCities() {
        return cityRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"))
                .stream()
                .map(this::mapToCityDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminCityDto createCity(CreateCityRequest request, UUID adminId, String ipAddress) {
        if (cityRepository.findBySlug(request.getSlug().trim().toLowerCase()).isPresent()) {
            throw new BadRequestException("City with slug '" + request.getSlug() + "' already exists");
        }

        City city = new City();
        city.setName(request.getName().trim());
        city.setState(request.getState().trim());
        city.setSlug(request.getSlug().trim().toLowerCase());
        city.setLatitude(request.getLatitude());
        city.setLongitude(request.getLongitude());
        city.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        city.setActive(request.isActive());

        City saved = cityRepository.save(city);

        auditLogPort.recordAction(
                adminId,
                "CREATE_CITY",
                "CITY",
                saved.getId().toString(),
                null,
                saved.getName(),
                "Created city " + saved.getName(),
                ipAddress,
                "SUCCESS"
        );

        return mapToCityDto(saved);
    }

    @Override
    @Transactional
    public AdminCityDto updateCity(Integer id, UpdateCityRequest request, UUID adminId, String ipAddress) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + id));

        city.setName(request.getName().trim());
        city.setState(request.getState().trim());
        city.setSlug(request.getSlug().trim().toLowerCase());
        if (request.getLatitude() != null) city.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) city.setLongitude(request.getLongitude());
        if (request.getDisplayOrder() != null) city.setDisplayOrder(request.getDisplayOrder());
        if (request.getIsActive() != null) city.setActive(request.getIsActive());

        City saved = cityRepository.save(city);

        auditLogPort.recordAction(
                adminId,
                "UPDATE_CITY",
                "CITY",
                id.toString(),
                null,
                saved.getName(),
                "Updated city " + saved.getName(),
                ipAddress,
                "SUCCESS"
        );

        return mapToCityDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminLocalityDto> getLocalitiesByCity(Integer cityId) {
        return localityRepository.findAllByCityIdOrderByDisplayOrderAsc(cityId)
                .stream()
                .map(this::mapToLocalityDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminLocalityDto createLocality(CreateLocalityRequest request, UUID adminId, String ipAddress) {
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));

        if (localityRepository.findByCityIdAndSlug(request.getCityId(), request.getSlug().trim().toLowerCase()).isPresent()) {
            throw new BadRequestException("Locality slug '" + request.getSlug() + "' already exists in city " + city.getName());
        }

        Locality locality = new Locality();
        locality.setCity(city);
        locality.setName(request.getName().trim());
        locality.setSlug(request.getSlug().trim().toLowerCase());
        locality.setLatitude(request.getLatitude());
        locality.setLongitude(request.getLongitude());
        locality.setPinCode(request.getPinCode());
        locality.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        Locality saved = localityRepository.save(locality);

        auditLogPort.recordAction(
                adminId,
                "CREATE_LOCALITY",
                "LOCALITY",
                saved.getId().toString(),
                null,
                saved.getName(),
                "Created locality in " + city.getName(),
                ipAddress,
                "SUCCESS"
        );

        return mapToLocalityDto(saved);
    }

    @Override
    @Transactional
    public AdminLocalityDto updateLocality(Integer id, UpdateLocalityRequest request, UUID adminId, String ipAddress) {
        Locality locality = localityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Locality not found with ID: " + id));

        if (request.getCityId() != null && !request.getCityId().equals(locality.getCity().getId())) {
            City newCity = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + request.getCityId()));
            locality.setCity(newCity);
        }

        locality.setName(request.getName().trim());
        locality.setSlug(request.getSlug().trim().toLowerCase());
        if (request.getLatitude() != null) locality.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) locality.setLongitude(request.getLongitude());
        if (request.getPinCode() != null) locality.setPinCode(request.getPinCode());
        if (request.getDisplayOrder() != null) locality.setDisplayOrder(request.getDisplayOrder());

        Locality saved = localityRepository.save(locality);

        auditLogPort.recordAction(
                adminId,
                "UPDATE_LOCALITY",
                "LOCALITY",
                id.toString(),
                null,
                saved.getName(),
                "Updated locality " + saved.getName(),
                ipAddress,
                "SUCCESS"
        );

        return mapToLocalityDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminFaqDto> getAllFaqs() {
        return faqRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToFaqDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminFaqDto createFaq(CreateFaqRequest request, UUID adminId, String ipAddress) {
        Faq faq = new Faq();
        faq.setQuestion(request.getQuestion().trim());
        faq.setAnswer(request.getAnswer().trim());
        faq.setCategory(StringUtils.hasText(request.getCategory()) ? request.getCategory().trim().toUpperCase() : "GENERAL");
        faq.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        Faq saved = faqRepository.save(faq);

        auditLogPort.recordAction(
                adminId,
                "CREATE_FAQ",
                "FAQ",
                saved.getId().toString(),
                null,
                saved.getQuestion(),
                "Created FAQ",
                ipAddress,
                "SUCCESS"
        );

        return mapToFaqDto(saved);
    }

    @Override
    @Transactional
    public AdminFaqDto updateFaq(Integer id, UpdateFaqRequest request, UUID adminId, String ipAddress) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found with ID: " + id));

        faq.setQuestion(request.getQuestion().trim());
        faq.setAnswer(request.getAnswer().trim());
        if (StringUtils.hasText(request.getCategory())) {
            faq.setCategory(request.getCategory().trim().toUpperCase());
        }
        if (request.getDisplayOrder() != null) {
            faq.setDisplayOrder(request.getDisplayOrder());
        }

        Faq saved = faqRepository.save(faq);

        auditLogPort.recordAction(
                adminId,
                "UPDATE_FAQ",
                "FAQ",
                id.toString(),
                null,
                saved.getQuestion(),
                "Updated FAQ",
                ipAddress,
                "SUCCESS"
        );

        return mapToFaqDto(saved);
    }

    @Override
    @Transactional
    public void deleteFaq(Integer id, UUID adminId, String ipAddress) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found with ID: " + id));

        String question = faq.getQuestion();
        faqRepository.delete(faq);

        auditLogPort.recordAction(
                adminId,
                "DELETE_FAQ",
                "FAQ",
                id.toString(),
                question,
                null,
                "Deleted FAQ",
                ipAddress,
                "SUCCESS"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminReportSummaryDto> searchReports(AdminReportFilterRequest filter) {
        String safeSort = ALLOWED_REPORT_SORT.contains(filter.getSortBy()) ? filter.getSortBy() : "createdAt";
        Sort.Direction direction = "ASC".equalsIgnoreCase(filter.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(direction, safeSort));

        Specification<Report> spec = AdminReportSpecification.build(filter);
        Page<Report> reportsPage = reportRepository.findAll(spec, pageable);

        return reportsPage.map(this::mapToReportSummaryDto);
    }

    @Override
    @Transactional
    public void updateReportStatus(UUID id, UpdateReportStatusRequest request, UUID adminId, String ipAddress) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Abuse report not found with ID: " + id));

        String targetStatus = request.getStatus().trim().toUpperCase();
        if (!VALID_REPORT_STATUSES.contains(targetStatus)) {
            throw new BadRequestException("Invalid report status: " + request.getStatus() + ". Allowed: " + VALID_REPORT_STATUSES);
        }

        String previousStatus = report.getStatus();
        report.setStatus(targetStatus);
        if (StringUtils.hasText(request.getComments())) {
            report.setComments((report.getComments() != null ? report.getComments() + "\n" : "") + "[Admin]: " + request.getComments().trim());
        }
        reportRepository.save(report);

        auditLogPort.recordAction(
                adminId,
                "UPDATE_REPORT_STATUS",
                "REPORT",
                id.toString(),
                previousStatus,
                targetStatus,
                request.getComments() != null ? request.getComments() : "Status updated to " + targetStatus,
                ipAddress,
                "SUCCESS"
        );

        log.info("Report {} updated from {} to {} by admin {}", id, previousStatus, targetStatus, adminId);
    }

    private AdminCityDto mapToCityDto(City city) {
        return new AdminCityDto(
                city.getId(),
                city.getName(),
                city.getState(),
                city.getSlug(),
                city.getLatitude(),
                city.getLongitude(),
                city.getDisplayOrder(),
                city.isActive()
        );
    }

    private AdminLocalityDto mapToLocalityDto(Locality locality) {
        return new AdminLocalityDto(
                locality.getId(),
                locality.getCity() != null ? locality.getCity().getId() : null,
                locality.getCity() != null ? locality.getCity().getName() : null,
                locality.getName(),
                locality.getSlug(),
                locality.getLatitude(),
                locality.getLongitude(),
                locality.getPinCode(),
                locality.getDisplayOrder()
        );
    }

    private AdminFaqDto mapToFaqDto(Faq faq) {
        return new AdminFaqDto(
                faq.getId(),
                faq.getQuestion(),
                faq.getAnswer(),
                faq.getCategory(),
                faq.getDisplayOrder()
        );
    }

    private AdminReportSummaryDto mapToReportSummaryDto(Report report) {
        AdminReportSummaryDto dto = new AdminReportSummaryDto();
        dto.setId(report.getId());
        if (report.getProperty() != null) {
            dto.setPropertyId(report.getProperty().getId());
            dto.setPropertyTitle(report.getProperty().getTitle());
            dto.setPropertyShortId(report.getProperty().getShortId());
        }
        if (report.getReportedByUser() != null) {
            dto.setReportedByUserId(report.getReportedByUser().getId());
            dto.setReportedByName(report.getReportedByUser().getName());
        }
        dto.setReason(report.getReason());
        dto.setComments(report.getComments());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
