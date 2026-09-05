package com.personalvault.service.project;

import com.personalvault.dto.project.CreateProjectRequest;
import com.personalvault.dto.project.ProjectResponse;
import com.personalvault.dto.project.UpdateProjectRequest;
import com.personalvault.entity.project.ProjectCategory;
import com.personalvault.entity.project.ProjectStatus;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(String userEmail, CreateProjectRequest request);

    List<ProjectResponse> getProjects(String userEmail, ProjectCategory category, ProjectStatus status, Boolean featured, String search);

    ProjectResponse getProjectById(String userEmail, Long projectId);

    ProjectResponse updateProject(String userEmail, Long projectId, UpdateProjectRequest request);

    void deleteProject(String userEmail, Long projectId);
}
