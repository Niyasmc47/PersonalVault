package com.personalvault.service.project;

import com.personalvault.dto.project.CreateProjectRequest;
import com.personalvault.dto.project.ProjectResponse;
import com.personalvault.dto.project.UpdateProjectRequest;
import com.personalvault.entity.auth.User;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(CreateProjectRequest request, User user);

    List<ProjectResponse> getAllProjects(User user);

    ProjectResponse getProjectById(Long projectId, User user);

    ProjectResponse updateProject(Long projectId, UpdateProjectRequest request, User user);

    void deleteProject(Long projectId, User user);
}
