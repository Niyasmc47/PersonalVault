package com.personalvault.dto.social;

import com.personalvault.entity.social.SocialPlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateSocialLinkRequest {

    @NotNull(message = "Platform is required")
    private SocialPlatform platform;

    @NotBlank(message = "Label is required")
    @Size(max = 100, message = "Label must not exceed 100 characters")
    private String label;

    @NotBlank(message = "URL is required")
    @Size(max = 500, message = "URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://).+", message = "URL must start with http:// or https://")
    private String url;

    @Size(max = 100, message = "Username must not exceed 100 characters")
    private String username;

    private boolean includeInResume = true;

    private Integer displayOrder = 0;

    public CreateSocialLinkRequest() {
    }

    public SocialPlatform getPlatform() {
        return platform;
    }

    public void setPlatform(SocialPlatform platform) {
        this.platform = platform;
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
}
