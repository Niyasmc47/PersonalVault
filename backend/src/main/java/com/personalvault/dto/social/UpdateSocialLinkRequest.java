package com.personalvault.dto.social;

import com.personalvault.entity.social.SocialPlatform;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateSocialLinkRequest {

    private SocialPlatform platform;

    @Size(max = 100, message = "Label must not exceed 100 characters")
    private String label;

    @Size(max = 500, message = "URL must not exceed 500 characters")
    @Pattern(regexp = "^(https?://).+", message = "URL must start with http:// or https://")
    private String url;

    @Size(max = 100, message = "Username must not exceed 100 characters")
    private String username;

    private Boolean includeInResume;

    private Integer displayOrder;

    public UpdateSocialLinkRequest() {
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

    public Boolean getIncludeInResume() {
        return includeInResume;
    }

    public void setIncludeInResume(Boolean includeInResume) {
        this.includeInResume = includeInResume;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
