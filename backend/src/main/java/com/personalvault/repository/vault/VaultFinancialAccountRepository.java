package com.personalvault.repository.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.FinancialAccountType;
import com.personalvault.entity.vault.VaultFinancialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaultFinancialAccountRepository extends JpaRepository<VaultFinancialAccount, Long> {

    List<VaultFinancialAccount> findByUserOrderByCreatedAtDesc(User user);

    List<VaultFinancialAccount> findByUserAndAccountTypeOrderByCreatedAtDesc(User user, FinancialAccountType accountType);

    @Query("SELECT f FROM VaultFinancialAccount f WHERE f.user = :user AND " +
           "(LOWER(f.bankName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.branch) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.ifsc) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.upiId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "f.maskedAccountNumber LIKE CONCAT('%', :search, '%')) " +
           "ORDER BY f.createdAt DESC")
    List<VaultFinancialAccount> searchAccounts(@Param("user") User user, @Param("search") String search);

    Optional<VaultFinancialAccount> findByIdAndUser(Long id, User user);
}
