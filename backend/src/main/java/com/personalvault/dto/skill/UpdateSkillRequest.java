package com.personalvault.dto.skill;

import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.SkillCategory;
import jakarta.validation.constraints.Size;

public class UpdateSkillRequest {

    @Size(max = 100, message = "Skill name must not exceed 100 characters")
    private String name;

    private SkillCategory category;

    private ProficiencyLevel proficiency;

    private Double yearsOfExperience;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private Boolean featured;

    private Boolean includeInResume;

    private Integer displayOrder;

    public UpdateSkillRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SkillCategory getCategory() {
        return category;
    }

    public void setCategory(SkillCategory category) {
        this.category = category;
    }

    public ProficiencyLevel getProficiency() {
        return proficiency;
    }

    public void setProficiency(ProficiencyLevel proficiency) {
        this.proficiency = proficiency;
    }

    public Double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Double yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
