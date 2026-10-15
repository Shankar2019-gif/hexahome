package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.content.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface AdminContentManagementUseCase {

    AdminPresignedUploadResponse generatePresignedUploadUrl(AdminPresignedUploadRequest request, UUID adminId, String ipAddress);

    List<AdminCityDto> getAllCities();

    AdminCityDto createCity(CreateCityRequest request, UUID adminId, String ipAddress);

    AdminCityDto updateCity(Integer id, UpdateCityRequest request, UUID adminId, String ipAddress);

    List<AdminLocalityDto> getLocalitiesByCity(Integer cityId);

    AdminLocalityDto createLocality(CreateLocalityRequest request, UUID adminId, String ipAddress);

    AdminLocalityDto updateLocality(Integer id, UpdateLocalityRequest request, UUID adminId, String ipAddress);

    List<AdminFaqDto> getAllFaqs();

    AdminFaqDto createFaq(CreateFaqRequest request, UUID adminId, String ipAddress);

    AdminFaqDto updateFaq(Integer id, UpdateFaqRequest request, UUID adminId, String ipAddress);

    void deleteFaq(Integer id, UUID adminId, String ipAddress);

    Page<AdminReportSummaryDto> searchReports(AdminReportFilterRequest filter);

    void updateReportStatus(UUID id, UpdateReportStatusRequest request, UUID adminId, String ipAddress);
}
