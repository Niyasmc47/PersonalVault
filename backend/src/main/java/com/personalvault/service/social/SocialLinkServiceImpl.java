package com.personalvault.service.social;

import com.personalvault.dto.social.CreateSocialLinkRequest;
import com.personalvault.dto.social.ReorderSocialLinksRequest;
import com.personalvault.dto.social.SocialLinkResponse;
import com.personalvault.dto.social.UpdateSocialLinkRequest;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.social.SocialLink;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.social.SocialLinkMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.social.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SocialLinkServiceImpl implements SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final UserRepository userRepository;
    private final SocialLinkMapper socialLinkMapper;

    public SocialLinkServiceImpl(SocialLinkRepository socialLinkRepository,
                                 UserRepository userRepository,
                                 SocialLinkMapper socialLinkMapper) {
        this.socialLinkRepository = socialLinkRepository;
        this.userRepository = userRepository;
        this.socialLinkMapper = socialLinkMapper;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public SocialLinkResponse createSocialLink(String userEmail, CreateSocialLinkRequest request) {
        User user = getAuthenticatedUser(userEmail);
        SocialLink socialLink = socialLinkMapper.toEntity(request);
        socialLink.setUser(user);

        if (request.getDisplayOrder() == null || request.getDisplayOrder() == 0) {
            long count = socialLinkRepository.countByUser(user);
            socialLink.setDisplayOrder((int) count);
        }

        SocialLink saved = socialLinkRepository.save(socialLink);
        return socialLinkMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getSocialLinks(String userEmail, Boolean includeInResume) {
        User user = getAuthenticatedUser(userEmail);

        List<SocialLink> list;
        if (includeInResume != null && includeInResume) {
            list = socialLinkRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtAsc(user);
        } else {
            list = socialLinkRepository.findByUserOrderByDisplayOrderAscCreatedAtAsc(user);
        }

        return list.stream()
                .filter(s -> includeInResume == null || s.isIncludeInResume() == includeInResume)
                .map(socialLinkMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SocialLinkResponse getSocialLinkById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        SocialLink socialLink = socialLinkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found with ID: " + id));
        return socialLinkMapper.toResponse(socialLink);
    }

    @Override
    @Transactional
    public SocialLinkResponse updateSocialLink(String userEmail, Long id, UpdateSocialLinkRequest request) {
        User user = getAuthenticatedUser(userEmail);
        SocialLink socialLink = socialLinkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found with ID: " + id));

        socialLinkMapper.updateEntityFromRequest(request, socialLink);
        SocialLink updated = socialLinkRepository.save(socialLink);
        return socialLinkMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSocialLink(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        SocialLink socialLink = socialLinkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found with ID: " + id));
        socialLinkRepository.delete(socialLink);
    }

    @Override
    @Transactional
    public List<SocialLinkResponse> reorderSocialLinks(String userEmail, ReorderSocialLinksRequest request) {
        User user = getAuthenticatedUser(userEmail);
        List<Long> ids = request.getSocialLinkIds();

        for (int i = 0; i < ids.size(); i++) {
            Long socialLinkId = ids.get(i);
            int order = i;
            socialLinkRepository.findByIdAndUser(socialLinkId, user).ifPresent(link -> {
                link.setDisplayOrder(order);
                socialLinkRepository.save(link);
            });
        }

        List<SocialLink> updatedList = socialLinkRepository.findByUserOrderByDisplayOrderAscCreatedAtAsc(user);
        return updatedList.stream().map(socialLinkMapper::toResponse).collect(Collectors.toList());
    }
}

