package com.personalvault.entity.vault;

import com.personalvault.entity.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vault_credentials")
public class VaultCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String username;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String encryptedPassword;

    @Column
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CredentialCategory category = CredentialCategory.LOGIN;

    @Column(columnDefinition = "TEXT")
    private String encryptedNotes;

    @Column(columnDefinition = "TEXT")
    private String encryptedApiKeys;

    @Column(columnDefinition = "TEXT")
    private String encryptedRecoveryCodes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public VaultCredential() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public CredentialCategory getCategory() {
        return category;
    }

    public void setCategory(CredentialCategory category) {
        this.category = category;
    }

    public String getEncryptedNotes() {
        return encryptedNotes;
    }

    public void setEncryptedNotes(String encryptedNotes) {
        this.encryptedNotes = encryptedNotes;
    }

    public String getEncryptedApiKeys() {
        return encryptedApiKeys;
    }

    public void setEncryptedApiKeys(String encryptedApiKeys) {
        this.encryptedApiKeys = encryptedApiKeys;
    }

    public String getEncryptedRecoveryCodes() {
        return encryptedRecoveryCodes;
    }

    public void setEncryptedRecoveryCodes(String encryptedRecoveryCodes) {
        this.encryptedRecoveryCodes = encryptedRecoveryCodes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
