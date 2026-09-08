package com.personalvault.repository.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.CredentialCategory;
import com.personalvault.entity.vault.VaultCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaultCredentialRepository extends JpaRepository<VaultCredential, Long> {

    List<VaultCredential> findByUserOrderByCreatedAtDesc(User user);

    List<VaultCredential> findByUserAndCategoryOrderByCreatedAtDesc(User user, CredentialCategory category);

    @Query("SELECT c FROM VaultCredential c WHERE c.user = :user AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.url) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<VaultCredential> searchCredentials(@Param("user") User user, @Param("search") String search);

    Optional<VaultCredential> findByIdAndUser(Long id, User user);
}
