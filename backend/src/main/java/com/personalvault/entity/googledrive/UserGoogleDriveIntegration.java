package com.personalvault.entity.googledrive;

import com.personalvault.entity.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_google_drive_integrations")
public class UserGoogleDriveIntegration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String accessToken;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String refreshToken;

    @Column
    private LocalDateTime tokenExpiry;

    @Column
    private String driveEmail;

    @Column
    private String personalVaultFolderId;

    @Column
    private String certificatesFolderId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime connectedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public UserGoogleDriveIntegration() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.connectedAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public LocalDateTime getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(LocalDateTime tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public String getDriveEmail() {
        return driveEmail;
    }

    public void setDriveEmail(String driveEmail) {
        this.driveEmail = driveEmail;
    }

    public String getPersonalVaultFolderId() {
        return personalVaultFolderId;
    }

    public void setPersonalVaultFolderId(String personalVaultFolderId) {
        this.personalVaultFolderId = personalVaultFolderId;
    }

    public String getCertificatesFolderId() {
        return certificatesFolderId;
    }

    public void setCertificatesFolderId(String certificatesFolderId) {
        this.certificatesFolderId = certificatesFolderId;
    }

    public LocalDateTime getConnectedAt() {
        return connectedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
