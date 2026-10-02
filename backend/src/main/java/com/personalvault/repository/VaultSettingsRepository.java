package com.personalvault.repository;

import com.personalvault.entity.User;
import com.personalvault.entity.VaultSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaultSettingsRepository extends JpaRepository<VaultSettings, Long> {
    Optional<VaultSettings> findByUser(User user);
    boolean existsByUser(User user);
}
