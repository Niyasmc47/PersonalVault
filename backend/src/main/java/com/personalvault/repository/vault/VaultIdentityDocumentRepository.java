package com.personalvault.repository.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.IdentityDocumentType;
import com.personalvault.entity.vault.VaultIdentityDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaultIdentityDocumentRepository extends JpaRepository<VaultIdentityDocument, Long> {

    List<VaultIdentityDocument> findByUserOrderByCreatedAtDesc(User user);

    List<VaultIdentityDocument> findByUserAndTypeOrderByCreatedAtDesc(User user, IdentityDocumentType type);

    @Query("SELECT d FROM VaultIdentityDocument d WHERE d.user = :user AND " +
           "(LOWER(d.holderName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "d.maskedNumber LIKE CONCAT('%', :search, '%')) " +
           "ORDER BY d.createdAt DESC")
    List<VaultIdentityDocument> searchIdentityDocuments(@Param("user") User user, @Param("search") String search);

    Optional<VaultIdentityDocument> findByIdAndUser(Long id, User user);
}
