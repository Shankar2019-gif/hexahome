package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.lead.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface AdminLeadManagementUseCase {

    Page<AdminLeadSummaryDto> searchLeads(AdminLeadFilterRequest request);

    AdminLeadDetailDto getLeadDetail(UUID leadId);

    void assignLead(UUID leadId, AssignLeadRequest request, UUID adminId, String ipAddress);

    void updateLeadStatus(UUID leadId, UpdateLeadStatusRequest request, UUID adminId, String ipAddress);

    List<LeadActivityDto> getLeadActivityHistory(UUID leadId);

    byte[] exportLeadsCsv(AdminLeadFilterRequest filter);
}
