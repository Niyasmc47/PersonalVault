package com.personalvault.service.project;

import com.personalvault.dto.project.CreateProjectRequest;
import com.personalvault.dto.project.ProjectResponse;
import com.personalvault.dto.project.UpdateProjectRequest;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.project.Project;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.project.ProjectMapper;
import com.personalvault.repository.project.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, User user) {
        Project project = projectMapper.toEntity(request);
        project.setUser(user);
        
        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User user) {
        return projectRepository.findAllByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId, User user) {
        Project project = getProjectEntity(projectId, user);
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long projectId, UpdateProjectRequest request, User user) {
        Project project = getProjectEntity(projectId, user);
        
        projectMapper.updateEntityFromRequest(request, project);
        Project updatedProject = projectRepository.save(project);
        
        return projectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId, User user) {
        Project project = getProjectEntity(projectId, user);
        projectRepository.delete(project);
    }

    private Project getProjectEntity(Long projectId, User user) {
        return projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found or you do not have permission to access it."));
    }
}
