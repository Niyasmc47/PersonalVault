package com.personalvault.controller.social;

import com.personalvault.dto.social.CreateSocialLinkRequest;
import com.personalvault.dto.social.ReorderSocialLinksRequest;
import com.personalvault.dto.social.SocialLinkResponse;
import com.personalvault.dto.social.UpdateSocialLinkRequest;
import com.personalvault.service.social.SocialLinkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social-links")
public class SocialLinkController {

    private final SocialLinkService socialLinkService;

    public SocialLinkController(SocialLinkService socialLinkService) {
        this.socialLinkService = socialLinkService;
    }

    @PostMapping
    public ResponseEntity<SocialLinkResponse> createSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateSocialLinkRequest request) {
        SocialLinkResponse response = socialLinkService.createSocialLink(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SocialLinkResponse>> getSocialLinks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Boolean includeInResume) {
        List<SocialLinkResponse> responses = socialLinkService.getSocialLinks(userDetails.getUsername(), includeInResume);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocialLinkResponse> getSocialLinkById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        SocialLinkResponse response = socialLinkService.getSocialLinkById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocialLinkResponse> updateSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateSocialLinkRequest request) {
        SocialLinkResponse response = socialLinkService.updateSocialLink(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        socialLinkService.deleteSocialLink(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<SocialLinkResponse>> reorderSocialLinks(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReorderSocialLinksRequest request) {
        List<SocialLinkResponse> responses = socialLinkService.reorderSocialLinks(userDetails.getUsername(), request);
        return ResponseEntity.ok(responses);
    }
}

