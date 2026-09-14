package com.personalvault.mapper.achievement;

import com.personalvault.dto.achievement.AchievementResponse;
import com.personalvault.dto.achievement.CreateAchievementRequest;
import com.personalvault.dto.achievement.UpdateAchievementRequest;
import com.personalvault.entity.achievement.Achievement;
import com.personalvault.entity.achievement.AchievementCategory;
import org.springframework.stereotype.Component;

@Component
public class AchievementMapper {

    public Achievement toEntity(CreateAchievementRequest request) {
        if (request == null) {
            return null;
        }

        Achievement achievement = new Achievement();
        achievement.setTitle(request.getTitle() != null ? request.getTitle().trim() : null);
        achievement.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        achievement.setOrganization(request.getOrganization() != null ? request.getOrganization().trim() : null);
        achievement.setAchievementDate(request.getAchievementDate());
        achievement.setCategory(request.getCategory());
        achievement.setUrl(request.getUrl() != null && !request.getUrl().isBlank() ? request.getUrl().trim() : null);
        achievement.setFeatured(request.isFeatured());
        achievement.setIncludeInResume(request.isIncludeInResume());
        achievement.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        return achievement;
    }

    public AchievementResponse toResponse(Achievement achievement) {
        if (achievement == null) {
            return null;
        }

        AchievementResponse response = new AchievementResponse();
        response.setId(achievement.getId());
        response.setTitle(achievement.getTitle());
        response.setDescription(achievement.getDescription());
        response.setOrganization(achievement.getOrganization());
        response.setAchievementDate(achievement.getAchievementDate());
        response.setCategory(achievement.getCategory());
        response.setCategoryDisplayName(formatCategory(achievement.getCategory()));
        response.setUrl(achievement.getUrl());
        response.setFeatured(achievement.isFeatured());
        response.setIncludeInResume(achievement.isIncludeInResume());
        response.setDisplayOrder(achievement.getDisplayOrder());
        response.setCreatedAt(achievement.getCreatedAt());
        response.setUpdatedAt(achievement.getUpdatedAt());

        return response;
    }

    public void updateEntityFromRequest(UpdateAchievementRequest request, Achievement achievement) {
        if (request == null || achievement == null) {
            return;
        }

        if (request.getTitle() != null) {
            achievement.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            achievement.setDescription(request.getDescription().trim());
        }
        if (request.getOrganization() != null) {
            achievement.setOrganization(request.getOrganization().trim());
        }
        if (request.getAchievementDate() != null) {
            achievement.setAchievementDate(request.getAchievementDate());
        }
        if (request.getCategory() != null) {
            achievement.setCategory(request.getCategory());
        }
        if (request.getUrl() != null) {
            achievement.setUrl(!request.getUrl().isBlank() ? request.getUrl().trim() : null);
        }
        if (request.getFeatured() != null) {
            achievement.setFeatured(request.getFeatured());
        }
        if (request.getIncludeInResume() != null) {
            achievement.setIncludeInResume(request.getIncludeInResume());
        }
        if (request.getDisplayOrder() != null) {
            achievement.setDisplayOrder(request.getDisplayOrder());
        }
    }

    private String formatCategory(AchievementCategory category) {
        if (category == null) return "";
        return switch (category) {
            case COMPETITION -> "Competition";
            case HACKATHON -> "Hackathon";
            case AWARD -> "Award";
            case ACADEMIC -> "Academic";
            case LEADERSHIP -> "Leadership";
            case RESEARCH -> "Research";
            case PUBLICATION -> "Publication";
            case VOLUNTEER -> "Volunteer";
            case SPORTS -> "Sports";
            case OTHER -> "Other";
        };
    }
}

