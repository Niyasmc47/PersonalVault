package com.personalvault.service.achievement;

import com.personalvault.dto.achievement.AchievementResponse;
import com.personalvault.dto.achievement.CreateAchievementRequest;
import com.personalvault.dto.achievement.ReorderAchievementsRequest;
import com.personalvault.dto.achievement.UpdateAchievementRequest;
import com.personalvault.entity.achievement.AchievementCategory;

import java.util.List;

public interface AchievementService {

    AchievementResponse createAchievement(String userEmail, CreateAchievementRequest request);

    List<AchievementResponse> getAchievements(String userEmail,
                                              AchievementCategory category,
                                              Boolean featured,
                                              Boolean includeInResume,
                                              String search);

    AchievementResponse getAchievementById(String userEmail, Long id);

    AchievementResponse updateAchievement(String userEmail, Long id, UpdateAchievementRequest request);

    void deleteAchievement(String userEmail, Long id);

    List<AchievementResponse> reorderAchievements(String userEmail, ReorderAchievementsRequest request);
}

