package com.personalvault.dto.social;

import com.personalvault.entity.social.SocialPlatform;
import java.time.LocalDateTime;

public class SocialLinkResponse {

    private Long id;
    private SocialPlatform platform;
    private String platformDisplayName;
    private String label;
    private String url;
    private String username;
    private boolean includeInResume;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SocialLinkResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SocialPlatform getPlatform() {
        return platform;
    }

    public void setPlatform(SocialPlatform platform) {
        this.platform = platform;
    }

    public String getPlatformDisplayName() {
        return platformDisplayName;
    }

    public void setPlatformDisplayName(String platformDisplayName) {
        this.platformDisplayName = platformDisplayName;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isIncludeInResume() {
        return includeInResume;
    }

    public void setIncludeInResume(boolean includeInResume) {
        this.includeInResume = includeInResume;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
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
