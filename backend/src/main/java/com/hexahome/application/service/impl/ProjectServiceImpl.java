package com.hexahome.application.service.impl;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.content.ProjectDetailDto;
import com.hexahome.application.dto.content.ProjectSummaryDto;
import com.hexahome.persistence.entity.Project;
import com.hexahome.persistence.repository.ProjectRepository;
import com.hexahome.application.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> getProjects(String citySlug, String status) {
        List<Project> projects;
        boolean hasCity = citySlug != null && !citySlug.isBlank();
        boolean hasStatus = status != null && !status.isBlank();

        if (hasCity && hasStatus) {
            projects = projectRepository.findAllByCitySlugAndStatus(citySlug.trim(), status.trim());
        } else if (hasCity) {
            projects = projectRepository.findAllByCitySlug(citySlug.trim());
        } else if (hasStatus) {
            projects = projectRepository.findAllByStatus(status.trim());
        } else {
            projects = projectRepository.findAllWithDetails();
        }

        return projects.stream()
                .map(ProjectSummaryDto::fromEntity)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> getFeaturedProjects() {
        return projectRepository.findAllFeaturedProjects()
                .stream()
                .map(ProjectSummaryDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailDto getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "slug", slug));
        return ProjectDetailDto.fromEntity(project);
    }
}
