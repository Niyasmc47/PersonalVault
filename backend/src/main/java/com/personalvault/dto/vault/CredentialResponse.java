package com.personalvault.dto.vault;

import com.personalvault.entity.vault.CredentialCategory;
import java.time.LocalDateTime;

public class CredentialResponse {

    private Long id;
    private String name;
    private String username;
    private String url;
    private CredentialCategory category;
    private boolean passwordAvailable;
    private boolean notesAvailable;
    private boolean apiKeysAvailable;
    private boolean recoveryCodesAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CredentialResponse() {
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public boolean isPasswordAvailable() {
        return passwordAvailable;
    }

    public void setPasswordAvailable(boolean passwordAvailable) {
        this.passwordAvailable = passwordAvailable;
    }

    public boolean isNotesAvailable() {
        return notesAvailable;
    }

    public void setNotesAvailable(boolean notesAvailable) {
        this.notesAvailable = notesAvailable;
    }

    public boolean isApiKeysAvailable() {
        return apiKeysAvailable;
    }

    public void setApiKeysAvailable(boolean apiKeysAvailable) {
        this.apiKeysAvailable = apiKeysAvailable;
    }

    public boolean isRecoveryCodesAvailable() {
        return recoveryCodesAvailable;
    }

    public void setRecoveryCodesAvailable(boolean recoveryCodesAvailable) {
        this.recoveryCodesAvailable = recoveryCodesAvailable;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
