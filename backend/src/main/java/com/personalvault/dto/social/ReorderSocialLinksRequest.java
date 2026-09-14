package com.personalvault.dto.social;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReorderSocialLinksRequest {

    @NotEmpty(message = "Social link IDs list cannot be empty")
    private List<Long> socialLinkIds;

    public ReorderSocialLinksRequest() {
    }

    public List<Long> getSocialLinkIds() {
        return socialLinkIds;
    }

    public void setSocialLinkIds(List<Long> socialLinkIds) {
        this.socialLinkIds = socialLinkIds;
    }
}

