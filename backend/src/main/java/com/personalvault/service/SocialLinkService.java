package com.personalvault.service;

import com.personalvault.dto.CreateSocialLinkRequest;
import com.personalvault.dto.ReorderSocialLinksRequest;
import com.personalvault.dto.SocialLinkResponse;
import com.personalvault.dto.UpdateSocialLinkRequest;

import java.util.List;

public interface SocialLinkService {

    SocialLinkResponse createSocialLink(String userEmail, CreateSocialLinkRequest request);

    List<SocialLinkResponse> getSocialLinks(String userEmail, Boolean includeInResume);

    SocialLinkResponse getSocialLinkById(String userEmail, Long id);

    SocialLinkResponse updateSocialLink(String userEmail, Long id, UpdateSocialLinkRequest request);

    void deleteSocialLink(String userEmail, Long id);

    List<SocialLinkResponse> reorderSocialLinks(String userEmail, ReorderSocialLinksRequest request);
}

