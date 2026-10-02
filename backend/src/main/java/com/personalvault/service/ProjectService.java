package com.personalvault.service;

import com.personalvault.dto.CreateProjectRequest;
import com.personalvault.dto.ProjectResponse;
import com.personalvault.dto.UpdateProjectRequest;
import com.personalvault.entity.ProjectCategory;
import com.personalvault.entity.ProjectStatus;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(String userEmail, CreateProjectRequest request);

    List<ProjectResponse> getProjects(String userEmail, ProjectCategory category, ProjectStatus status, Boolean featured, String search);

    ProjectResponse getProjectById(String userEmail, Long projectId);

    ProjectResponse updateProject(String userEmail, Long projectId, UpdateProjectRequest request);

    void deleteProject(String userEmail, Long projectId);
}
