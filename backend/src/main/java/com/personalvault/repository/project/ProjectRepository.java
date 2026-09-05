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

    List<Project> findByUserAndFeaturedTrueOrderByUpdatedAtDesc(User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, ProjectStatus status);

    long countByUserAndFeaturedTrue(User user);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.technologies t WHERE p.user = :user " +
           "AND (CAST(:category AS string) IS NULL OR p.category = :category) " +
           "AND (CAST(:status AS string) IS NULL OR p.status = :status) " +
           "AND (:featured IS NULL OR p.featured = :featured) " +
           "AND (:search IS NULL OR (" +
           "     LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(t) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")) " +
           "ORDER BY p.updatedAt DESC")
    List<Project> findByUserWithFilters(
            @Param("user") User user,
            @Param("category") ProjectCategory category,
            @Param("status") ProjectStatus status,
            @Param("featured") Boolean featured,
            @Param("search") String search
    );
}
