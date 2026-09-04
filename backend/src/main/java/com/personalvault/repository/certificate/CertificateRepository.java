package com.personalvault.repository.certificate;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.certificate.Certificate;
import com.personalvault.entity.certificate.CertificateCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUserOrderByIssueDateDesc(User user);

    List<Certificate> findByUserAndCategoryOrderByIssueDateDesc(User user, CertificateCategory category);

    Optional<Certificate> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    long countByUserAndCategory(User user, CertificateCategory category);

    @Query("SELECT c FROM Certificate c WHERE c.user = :user AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.issuer) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY c.issueDate DESC")
    List<Certificate> searchCertificates(@Param("user") User user, @Param("query") String query);

    @Query("SELECT c.category, COUNT(c) FROM Certificate c WHERE c.user = :user GROUP BY c.category")
    List<Object[]> countGroupByCategory(@Param("user") User user);
}
