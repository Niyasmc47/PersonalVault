package com.personalvault.mapper.social;

import com.personalvault.dto.social.CreateSocialLinkRequest;
import com.personalvault.dto.social.SocialLinkResponse;
import com.personalvault.dto.social.UpdateSocialLinkRequest;
import com.personalvault.entity.social.SocialLink;
import com.personalvault.entity.social.SocialPlatform;
import org.springframework.stereotype.Component;

@Component
public class SocialLinkMapper {

    public SocialLink toEntity(CreateSocialLinkRequest request) {
        if (request == null) {
            return null;
        }

        SocialLink socialLink = new SocialLink();
        socialLink.setPlatform(request.getPlatform());
        socialLink.setLabel(request.getLabel() != null ? request.getLabel().trim() : null);
        socialLink.setUrl(request.getUrl() != null ? request.getUrl().trim() : null);
        socialLink.setUsername(request.getUsername() != null && !request.getUsername().isBlank() ? request.getUsername().trim() : null);
        socialLink.setIncludeInResume(request.isIncludeInResume());
        socialLink.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        return socialLink;
    }

    public SocialLinkResponse toResponse(SocialLink socialLink) {
        if (socialLink == null) {
            return null;
        }

        SocialLinkResponse response = new SocialLinkResponse();
        response.setId(socialLink.getId());
        response.setPlatform(socialLink.getPlatform());
        response.setPlatformDisplayName(formatPlatform(socialLink.getPlatform()));
        response.setLabel(socialLink.getLabel());
        response.setUrl(socialLink.getUrl());
        response.setUsername(socialLink.getUsername());
        response.setIncludeInResume(socialLink.isIncludeInResume());
        response.setDisplayOrder(socialLink.getDisplayOrder());
        response.setCreatedAt(socialLink.getCreatedAt());
        response.setUpdatedAt(socialLink.getUpdatedAt());

        return response;
    }

    public void updateEntityFromRequest(UpdateSocialLinkRequest request, SocialLink socialLink) {
        if (request == null || socialLink == null) {
            return;
        }

        if (request.getPlatform() != null) {
            socialLink.setPlatform(request.getPlatform());
        }
        if (request.getLabel() != null) {
            socialLink.setLabel(request.getLabel().trim());
        }
        if (request.getUrl() != null) {
            socialLink.setUrl(request.getUrl().trim());
        }
        if (request.getUsername() != null) {
            socialLink.setUsername(!request.getUsername().isBlank() ? request.getUsername().trim() : null);
        }
        if (request.getIncludeInResume() != null) {
            socialLink.setIncludeInResume(request.getIncludeInResume());
        }
        if (request.getDisplayOrder() != null) {
            socialLink.setDisplayOrder(request.getDisplayOrder());
        }
    }

    private String formatPlatform(SocialPlatform platform) {
        if (platform == null) return "";
        return switch (platform) {
            case GITHUB -> "GitHub";
            case LINKEDIN -> "LinkedIn";
            case PORTFOLIO -> "Portfolio";
            case LEETCODE -> "LeetCode";
            case CODECHEF -> "CodeChef";
            case HACKERRANK -> "HackerRank";
            case KAGGLE -> "Kaggle";
            case BEHANCE -> "Behance";
            case DRIBBBLE -> "Dribbble";
            case X -> "X (Twitter)";
            case YOUTUBE -> "YouTube";
            case PERSONAL_WEBSITE -> "Personal Website";
            case OTHER -> "Other";
        };
    }
}

