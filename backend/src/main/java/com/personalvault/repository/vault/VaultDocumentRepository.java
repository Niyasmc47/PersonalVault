package com.personalvault.repository.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.VaultDocument;
import com.personalvault.entity.vault.VaultDocumentCategory;
import com.personalvault.entity.vault.VaultDocumentSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaultDocumentRepository extends JpaRepository<VaultDocument, Long> {

    List<VaultDocument> findByUserAndSectionOrderByCreatedAtDesc(User user, VaultDocumentSection section);

    List<VaultDocument> findByUserAndSectionAndCategoryOrderByCreatedAtDesc(
            User user, VaultDocumentSection section, VaultDocumentCategory category);

    @Query("SELECT d FROM VaultDocument d WHERE d.user = :user AND d.section = :section AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.issuerOrInstitution) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.documentIdentifier) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY d.createdAt DESC")
    List<VaultDocument> searchDocuments(
            @Param("user") User user,
            @Param("section") VaultDocumentSection section,
            @Param("search") String search);

    Optional<VaultDocument> findByIdAndUser(Long id, User user);
}
