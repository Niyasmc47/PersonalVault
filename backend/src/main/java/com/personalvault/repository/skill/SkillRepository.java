package com.personalvault.repository.skill;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.Skill;
import com.personalvault.entity.skill.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUserOrderByDisplayOrderAscCreatedAtDesc(User user);

    List<Skill> findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtDesc(User user);

    List<Skill> findByUserAndCategoryOrderByDisplayOrderAscCreatedAtDesc(User user, SkillCategory category);

    List<Skill> findByUserAndProficiencyOrderByDisplayOrderAscCreatedAtDesc(User user, ProficiencyLevel proficiency);

    List<Skill> findByUserAndFeaturedTrueOrderByDisplayOrderAscCreatedAtDesc(User user);

    Optional<Skill> findByIdAndUser(Long id, User user);

    @Query("SELECT s FROM Skill s WHERE s.user = :user AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY s.displayOrder ASC, s.createdAt DESC")
    List<Skill> searchSkills(@Param("user") User user, @Param("search") String search);

    long countByUser(User user);
}

