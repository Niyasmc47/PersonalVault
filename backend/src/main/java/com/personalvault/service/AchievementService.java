package com.personalvault.service;

import com.personalvault.dto.AchievementResponse;
import com.personalvault.dto.CreateAchievementRequest;
import com.personalvault.dto.ReorderAchievementsRequest;
import com.personalvault.dto.UpdateAchievementRequest;
import com.personalvault.entity.AchievementCategory;

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

