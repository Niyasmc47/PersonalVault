package com.personalvault.dto.achievement;

import com.personalvault.entity.achievement.AchievementCategory;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdateAchievementRequest {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 150, message = "Organization must not exceed 150 characters")
    private String organization;

    private LocalDate achievementDate;

    private AchievementCategory category;

    @Size(max = 500, message = "URL must not exceed 500 characters")
    private String url;

    private Boolean featured;

    private Boolean includeInResume;

    private Integer displayOrder;

    public UpdateAchievementRequest() {
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

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getIncludeInResume() {
        return includeInResume;
    }

    public void setIncludeInResume(Boolean includeInResume) {
        this.includeInResume = includeInResume;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
