package com.hexahome.application.service.impl;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.engagement.CreateReportRequest;
import com.hexahome.application.dto.engagement.ReportResponseDto;
import com.hexahome.persistence.entity.Property;
import com.hexahome.persistence.entity.Report;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PropertyRepository;
import com.hexahome.persistence.repository.ReportRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.application.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(
            ReportRepository reportRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ReportResponseDto createReport(UUID userId, CreateReportRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Report report = new Report(
                property,
                user,
                request.getReason(),
                request.getComments()
        );

        Report saved = reportRepository.save(report);
        return ReportResponseDto.fromEntity(saved);
    }
}
