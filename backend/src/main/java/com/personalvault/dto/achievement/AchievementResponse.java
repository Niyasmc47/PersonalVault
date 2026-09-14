package com.personalvault.dto.achievement;

import com.personalvault.entity.achievement.AchievementCategory;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AchievementResponse {

    private Long id;
    private String title;
    private String description;
    private String organization;
    private LocalDate achievementDate;
    private AchievementCategory category;
    private String categoryDisplayName;
    private String url;
    private boolean featured;
    private boolean includeInResume;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AchievementResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
