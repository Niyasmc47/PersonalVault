package com.personalvault.dto.achievement;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReorderAchievementsRequest {

    @NotEmpty(message = "Achievement IDs list cannot be empty")
    private List<Long> achievementIds;

    public ReorderAchievementsRequest() {
    }

    public List<Long> getAchievementIds() {
        return achievementIds;
    }

    public void setAchievementIds(List<Long> achievementIds) {
        this.achievementIds = achievementIds;
    }
}

