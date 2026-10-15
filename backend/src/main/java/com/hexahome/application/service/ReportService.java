package com.hexahome.application.service;

import com.hexahome.application.dto.engagement.CreateReportRequest;
import com.hexahome.application.dto.engagement.ReportResponseDto;

import java.util.UUID;

public interface ReportService {

    ReportResponseDto createReport(UUID userId, CreateReportRequest request);
}
