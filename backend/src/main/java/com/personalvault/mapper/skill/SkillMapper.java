package com.personalvault.mapper.skill;

import com.personalvault.dto.skill.CreateSkillRequest;
import com.personalvault.dto.skill.SkillResponse;
import com.personalvault.dto.skill.UpdateSkillRequest;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.Skill;
import com.personalvault.entity.skill.SkillCategory;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {

    public Skill toEntity(CreateSkillRequest request) {
        if (request == null) {
            return null;
        }

        Skill skill = new Skill();
        skill.setName(request.getName() != null ? request.getName().trim() : null);
        skill.setCategory(request.getCategory());
        skill.setProficiency(request.getProficiency());
        skill.setYearsOfExperience(request.getYearsOfExperience());
        skill.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        skill.setFeatured(request.isFeatured());
        skill.setIncludeInResume(request.isIncludeInResume());
        skill.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        return skill;
    }

    public SkillResponse toResponse(Skill skill) {
        if (skill == null) {
            return null;
        }

        SkillResponse response = new SkillResponse();
        response.setId(skill.getId());
        response.setName(skill.getName());
        response.setCategory(skill.getCategory());
        response.setCategoryDisplayName(formatCategory(skill.getCategory()));
        response.setProficiency(skill.getProficiency());
        response.setProficiencyDisplayName(formatProficiency(skill.getProficiency()));
        response.setYearsOfExperience(skill.getYearsOfExperience());
        response.setDescription(skill.getDescription());
        response.setFeatured(skill.isFeatured());
        response.setIncludeInResume(skill.isIncludeInResume());
        response.setDisplayOrder(skill.getDisplayOrder());
        response.setCreatedAt(skill.getCreatedAt());
        response.setUpdatedAt(skill.getUpdatedAt());

        return response;
    }

    public void updateEntityFromRequest(UpdateSkillRequest request, Skill skill) {
        if (request == null || skill == null) {
            return;
        }

        if (request.getName() != null) {
            skill.setName(request.getName().trim());
        }
        if (request.getCategory() != null) {
            skill.setCategory(request.getCategory());
        }
        if (request.getProficiency() != null) {
            skill.setProficiency(request.getProficiency());
        }
        if (request.getYearsOfExperience() != null) {
            skill.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getDescription() != null) {
            skill.setDescription(request.getDescription().trim());
        }
        if (request.getFeatured() != null) {
            skill.setFeatured(request.getFeatured());
        }
        if (request.getIncludeInResume() != null) {
            skill.setIncludeInResume(request.getIncludeInResume());
        }
        if (request.getDisplayOrder() != null) {
            skill.setDisplayOrder(request.getDisplayOrder());
        }
    }

    private String formatCategory(SkillCategory category) {
        if (category == null) return "";
        return switch (category) {
            case PROGRAMMING_LANGUAGE -> "Programming Language";
            case FRAMEWORK -> "Framework";
            case DATABASE -> "Database";
            case CLOUD -> "Cloud";
            case DEVOPS -> "DevOps";
            case TOOLS -> "Tools";
            case SOFT_SKILLS -> "Soft Skills";
            case OTHER -> "Other";
        };
    }

    private String formatProficiency(ProficiencyLevel proficiency) {
        if (proficiency == null) return "";
        return switch (proficiency) {
            case BEGINNER -> "Beginner";
            case INTERMEDIATE -> "Intermediate";
            case ADVANCED -> "Advanced";
            case EXPERT -> "Expert";
        };
    }
}

