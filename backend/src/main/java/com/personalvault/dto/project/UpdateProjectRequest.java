package com.personalvault.dto.project;

import com.personalvault.entity.project.ProjectCategory;
import com.personalvault.entity.project.ProjectStatus;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class UpdateProjectRequest {

    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    private ProjectCategory category;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> technologies;

    @Pattern(regexp = "^(https?://.*)?$", message = "GitHub URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "GitHub URL cannot exceed 500 characters")
    private String githubUrl;

    @Pattern(regexp = "^(https?://.*)?$", message = "Live URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "Live URL cannot exceed 500 characters")
    private String liveUrl;

    @Pattern(regexp = "^(https?://.*)?$", message = "Demo URL must be a valid URL starting with http:// or https://")
    @Size(max = 500, message = "Demo URL cannot exceed 500 characters")
    private String demoUrl;

    private Boolean featured;

    // Getters and Setters

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProjectCategory getCategory() { return category; }
    public void setCategory(ProjectCategory category) { this.category = category; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
}
