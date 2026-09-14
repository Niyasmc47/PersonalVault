package com.personalvault.dto.achievement;

import com.personalvault.entity.achievement.AchievementCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CreateAchievementRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Organization is required")
    @Size(max = 150, message = "Organization must not exceed 150 characters")
    private String organization;

    @NotNull(message = "Achievement date is required")
    private LocalDate achievementDate;

    @NotNull(message = "Category is required")
    private AchievementCategory category;

    @Size(max = 500, message = "URL must not exceed 500 characters")
    private String url;

    private boolean featured = false;

    private boolean includeInResume = true;

    private Integer displayOrder = 0;

    public CreateAchievementRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public LocalDate getAchievementDate() {
        return achievementDate;
    }

    public void setAchievementDate(LocalDate achievementDate) {
        this.achievementDate = achievementDate;
    }

    public AchievementCategory getCategory() {
        return category;
    }

    public void setCategory(AchievementCategory category) {
        this.category = category;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public boolean isIncludeInResume() {
        return includeInResume;
    }

    public void setIncludeInResume(boolean includeInResume) {
        this.includeInResume = includeInResume;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
