package com.personalvault.repository.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.VaultSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaultSettingsRepository extends JpaRepository<VaultSettings, Long> {
    Optional<VaultSettings> findByUser(User user);
    boolean existsByUser(User user);
}
