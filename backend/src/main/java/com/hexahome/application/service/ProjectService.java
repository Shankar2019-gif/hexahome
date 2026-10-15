package com.hexahome.application.service;

import com.hexahome.application.dto.content.ProjectDetailDto;
import com.hexahome.application.dto.content.ProjectSummaryDto;

import java.util.List;

public interface ProjectService {

    List<ProjectSummaryDto> getProjects(String citySlug, String status);

    List<ProjectSummaryDto> getFeaturedProjects();

    ProjectDetailDto getProjectBySlug(String slug);
}
