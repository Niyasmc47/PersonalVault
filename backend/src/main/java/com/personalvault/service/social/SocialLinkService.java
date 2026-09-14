package com.personalvault.service.social;

import com.personalvault.dto.social.CreateSocialLinkRequest;
import com.personalvault.dto.social.ReorderSocialLinksRequest;
import com.personalvault.dto.social.SocialLinkResponse;
import com.personalvault.dto.social.UpdateSocialLinkRequest;

import java.util.List;

public interface SocialLinkService {

    SocialLinkResponse createSocialLink(String userEmail, CreateSocialLinkRequest request);

    List<SocialLinkResponse> getSocialLinks(String userEmail, Boolean includeInResume);

    SocialLinkResponse getSocialLinkById(String userEmail, Long id);

    SocialLinkResponse updateSocialLink(String userEmail, Long id, UpdateSocialLinkRequest request);

    void deleteSocialLink(String userEmail, Long id);

    List<SocialLinkResponse> reorderSocialLinks(String userEmail, ReorderSocialLinksRequest request);
}

