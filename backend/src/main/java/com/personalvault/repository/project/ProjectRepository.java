package com.personalvault.repository.project;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.project.Project;
import com.personalvault.entity.project.ProjectCategory;
import com.personalvault.entity.project.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUserOrderByUpdatedAtDesc(User user);

    Optional<Project> findByIdAndUser(Long id, User user);

    List<Project> findByUserAndCategoryOrderByUpdatedAtDesc(User user, ProjectCategory category);

    List<Project> findByUserAndStatusOrderByUpdatedAtDesc(User user, ProjectStatus status);

    List<Project> findByUserAndFeaturedTrueOrderByUpdatedAtDesc(User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, ProjectStatus status);

    long countByUserAndFeaturedTrue(User user);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.technologies t WHERE p.user = :user AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(t) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY p.updatedAt DESC")
    List<Project> searchProjects(@Param("user") User user, @Param("query") String query);
}
