package com.personalvault.entity.auth;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(nullable = true, unique = true)
    private String providerId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.personalvault.entity.certificate.Certificate> certificates = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<com.personalvault.entity.project.Project> projects = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private com.personalvault.entity.googledrive.UserGoogleDriveIntegration googleDriveIntegration;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public User() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public java.util.List<com.personalvault.entity.certificate.Certificate> getCertificates() {
        return certificates;
    }

    public void setCertificates(java.util.List<com.personalvault.entity.certificate.Certificate> certificates) {
        this.certificates = certificates;
    }

    public java.util.List<com.personalvault.entity.project.Project> getProjects() {
        return projects;
    }

    public void setProjects(java.util.List<com.personalvault.entity.project.Project> projects) {
        this.projects = projects;
    }

    public com.personalvault.entity.googledrive.UserGoogleDriveIntegration getGoogleDriveIntegration() {
        return googleDriveIntegration;
    }

    public void setGoogleDriveIntegration(com.personalvault.entity.googledrive.UserGoogleDriveIntegration googleDriveIntegration) {
        this.googleDriveIntegration = googleDriveIntegration;
    }
}