package com.personalvault.repository.googledrive;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.googledrive.UserGoogleDriveIntegration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserGoogleDriveIntegrationRepository extends JpaRepository<UserGoogleDriveIntegration, Long> {

    Optional<UserGoogleDriveIntegration> findByUser(User user);

    boolean existsByUser(User user);

    void deleteByUser(User user);
}
