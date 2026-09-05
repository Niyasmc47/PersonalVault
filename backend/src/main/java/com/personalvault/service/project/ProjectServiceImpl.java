package com.personalvault.service.project;

import com.personalvault.dto.project.CreateProjectRequest;
import com.personalvault.dto.project.ProjectResponse;
import com.personalvault.dto.project.UpdateProjectRequest;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.project.Project;
import com.personalvault.entity.project.ProjectCategory;
import com.personalvault.entity.project.ProjectStatus;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.project.ProjectMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.project.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository,
                              ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new InvalidRequestException("End date cannot be earlier than start date");
        }
    }

    @Override
    @Transactional
    public ProjectResponse createProject(String userEmail, CreateProjectRequest request) {
        User user = getAuthenticatedUser(userEmail);
        validateDates(request.getStartDate(), request.getEndDate());

        Project project = projectMapper.toEntity(request);
        project.setUser(user);

        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(String userEmail,
                                            ProjectCategory category,
                                            ProjectStatus status,
                                            Boolean featured,
                                            String search) {
        User user = getAuthenticatedUser(userEmail);

        List<Project> projects;
        if (search != null && !search.isBlank()) {
            projects = projectRepository.searchProjects(user, search.trim());
        } else if (category != null) {
            projects = projectRepository.findByUserAndCategoryOrderByUpdatedAtDesc(user, category);
        } else if (status != null) {
            projects = projectRepository.findByUserAndStatusOrderByUpdatedAtDesc(user, status);
        } else if (featured != null && featured) {
            projects = projectRepository.findByUserAndFeaturedTrueOrderByUpdatedAtDesc(user);
        } else {
            projects = projectRepository.findByUserOrderByUpdatedAtDesc(user);
        }

        return projects.stream()
                .filter(p -> {
                    if (category != null && p.getCategory() != category) return false;
                    if (status != null && p.getStatus() != status) return false;
                    if (featured != null && p.isFeatured() != featured) return false;
                    return true;
                })
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String userEmail, Long projectId) {
        User user = getAuthenticatedUser(userEmail);
        Project project = getProjectEntity(projectId, user);
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(String userEmail, Long projectId, UpdateProjectRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Project project = getProjectEntity(projectId, user);

        LocalDate effectiveStart = request.getStartDate() != null ? request.getStartDate() : project.getStartDate();
        LocalDate effectiveEnd = request.getEndDate() != null ? request.getEndDate() : project.getEndDate();
        validateDates(effectiveStart, effectiveEnd);

        projectMapper.updateEntityFromRequest(request, project);
        Project updatedProject = projectRepository.save(project);

        return projectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(String userEmail, Long projectId) {
        User user = getAuthenticatedUser(userEmail);
        Project project = getProjectEntity(projectId, user);
        projectRepository.delete(project);
    }

    private Project getProjectEntity(Long projectId, User user) {
        return projectRepository.findByIdAndUser(projectId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));
    }
}
