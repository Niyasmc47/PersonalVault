package com.personalvault.dto.skill;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReorderSkillsRequest {

    @NotEmpty(message = "Skill IDs list cannot be empty")
    private List<Long> skillIds;

    public ReorderSkillsRequest() {
    }

    public List<Long> getSkillIds() {
        return skillIds;
    }

    public void setSkillIds(List<Long> skillIds) {
        this.skillIds = skillIds;
    }
}

