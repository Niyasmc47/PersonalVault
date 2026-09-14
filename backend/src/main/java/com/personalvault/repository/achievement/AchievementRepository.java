package com.personalvault.repository.achievement;

import com.personalvault.entity.achievement.Achievement;
import com.personalvault.entity.achievement.AchievementCategory;
import com.personalvault.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByUserOrderByDisplayOrderAscAchievementDateDesc(User user);

    List<Achievement> findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscAchievementDateDesc(User user);

    List<Achievement> findByUserAndCategoryOrderByDisplayOrderAscAchievementDateDesc(User user, AchievementCategory category);

    List<Achievement> findByUserAndFeaturedTrueOrderByDisplayOrderAscAchievementDateDesc(User user);

    Optional<Achievement> findByIdAndUser(Long id, User user);

    @Query("SELECT a FROM Achievement a WHERE a.user = :user AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.organization) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.displayOrder ASC, a.achievementDate DESC")
    List<Achievement> searchAchievements(@Param("user") User user, @Param("search") String search);

    long countByUser(User user);
}

