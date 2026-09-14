package com.personalvault.service.achievement;

import com.personalvault.dto.achievement.AchievementResponse;
import com.personalvault.dto.achievement.CreateAchievementRequest;
import com.personalvault.dto.achievement.ReorderAchievementsRequest;
import com.personalvault.dto.achievement.UpdateAchievementRequest;
import com.personalvault.entity.achievement.Achievement;
import com.personalvault.entity.achievement.AchievementCategory;
import com.personalvault.entity.auth.User;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.achievement.AchievementMapper;
import com.personalvault.repository.achievement.AchievementRepository;
import com.personalvault.repository.auth.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;
    private final AchievementMapper achievementMapper;

    public AchievementServiceImpl(AchievementRepository achievementRepository,
                                  UserRepository userRepository,
                                  AchievementMapper achievementMapper) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
        this.achievementMapper = achievementMapper;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public AchievementResponse createAchievement(String userEmail, CreateAchievementRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Achievement achievement = achievementMapper.toEntity(request);
        achievement.setUser(user);

        if (request.getDisplayOrder() == null || request.getDisplayOrder() == 0) {
            long count = achievementRepository.countByUser(user);
            achievement.setDisplayOrder((int) count);
        }

        Achievement saved = achievementRepository.save(achievement);
        return achievementMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementResponse> getAchievements(String userEmail,
                                                     AchievementCategory category,
                                                     Boolean featured,
                                                     Boolean includeInResume,
                                                     String search) {
        User user = getAuthenticatedUser(userEmail);

        List<Achievement> achievements;
        if (search != null && !search.isBlank()) {
            achievements = achievementRepository.searchAchievements(user, search.trim());
        } else if (category != null) {
            achievements = achievementRepository.findByUserAndCategoryOrderByDisplayOrderAscAchievementDateDesc(user, category);
        } else if (featured != null && featured) {
            achievements = achievementRepository.findByUserAndFeaturedTrueOrderByDisplayOrderAscAchievementDateDesc(user);
        } else if (includeInResume != null && includeInResume) {
            achievements = achievementRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscAchievementDateDesc(user);
        } else {
            achievements = achievementRepository.findByUserOrderByDisplayOrderAscAchievementDateDesc(user);
        }

        return achievements.stream()
                .filter(a -> {
                    if (category != null && a.getCategory() != category) return false;
                    if (featured != null && a.isFeatured() != featured) return false;
                    if (includeInResume != null && a.isIncludeInResume() != includeInResume) return false;
                    return true;
                })
                .map(achievementMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AchievementResponse getAchievementById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Achievement achievement = achievementRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));
        return achievementMapper.toResponse(achievement);
    }

    @Override
    @Transactional
    public AchievementResponse updateAchievement(String userEmail, Long id, UpdateAchievementRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Achievement achievement = achievementRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));

        achievementMapper.updateEntityFromRequest(request, achievement);
        Achievement updated = achievementRepository.save(achievement);
        return achievementMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAchievement(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Achievement achievement = achievementRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));
        achievementRepository.delete(achievement);
    }

    @Override
    @Transactional
    public List<AchievementResponse> reorderAchievements(String userEmail, ReorderAchievementsRequest request) {
        User user = getAuthenticatedUser(userEmail);
        List<Long> ids = request.getAchievementIds();

        for (int i = 0; i < ids.size(); i++) {
            Long achievementId = ids.get(i);
            int order = i;
            achievementRepository.findByIdAndUser(achievementId, user).ifPresent(ach -> {
                ach.setDisplayOrder(order);
                achievementRepository.save(ach);
            });
        }

        List<Achievement> updatedList = achievementRepository.findByUserOrderByDisplayOrderAscAchievementDateDesc(user);
        return updatedList.stream().map(achievementMapper::toResponse).collect(Collectors.toList());
    }
}

