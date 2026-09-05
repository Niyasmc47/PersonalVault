package com.personalvault.mapper.project;

import com.personalvault.dto.project.CreateProjectRequest;
import com.personalvault.dto.project.ProjectResponse;
import com.personalvault.dto.project.UpdateProjectRequest;
import com.personalvault.entity.project.Project;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public Project toEntity(CreateProjectRequest request) {
        if (request == null) {
            return null;
        }

        Project project = new Project();
        project.setTitle(request.getTitle() != null ? request.getTitle().trim() : null);
        project.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        project.setCategory(request.getCategory());
        project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setTechnologies(cleanTechnologies(request.getTechnologies()));
        project.setGithubUrl(request.getGithubUrl() != null && !request.getGithubUrl().isBlank() ? request.getGithubUrl().trim() : null);
        project.setLiveUrl(request.getLiveUrl() != null && !request.getLiveUrl().isBlank() ? request.getLiveUrl().trim() : null);
        project.setDemoUrl(request.getDemoUrl() != null && !request.getDemoUrl().isBlank() ? request.getDemoUrl().trim() : null);
        project.setFeatured(request.isFeatured());
        
        return project;
    }

    public ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }

        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        response.setTechnologies(project.getTechnologies() != null ? new ArrayList<>(project.getTechnologies()) : new ArrayList<>());
        response.setGithubUrl(project.getGithubUrl());
        response.setLiveUrl(project.getLiveUrl());
        response.setDemoUrl(project.getDemoUrl());
        response.setFeatured(project.isFeatured());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());

        return response;
    }

    public void updateEntityFromRequest(UpdateProjectRequest request, Project project) {
        if (request == null || project == null) {
            return;
        }

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription().trim());
        }
        if (request.getCategory() != null) {
            project.setCategory(request.getCategory());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getTechnologies() != null) {
            project.setTechnologies(cleanTechnologies(request.getTechnologies()));
        }
        if (request.getGithubUrl() != null) {
            project.setGithubUrl(!request.getGithubUrl().isBlank() ? request.getGithubUrl().trim() : null);
        }
        if (request.getLiveUrl() != null) {
            project.setLiveUrl(!request.getLiveUrl().isBlank() ? request.getLiveUrl().trim() : null);
        }
        if (request.getDemoUrl() != null) {
            project.setDemoUrl(!request.getDemoUrl().isBlank() ? request.getDemoUrl().trim() : null);
        }
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
    }

    public List<String> cleanTechnologies(List<String> rawTechnologies) {
        if (rawTechnologies == null) {
            return new ArrayList<>();
        }
        return rawTechnologies.stream()
                .filter(t -> t != null && !t.trim().isEmpty())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());
    }
}
