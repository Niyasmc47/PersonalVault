package com.personalvault.controller.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.vault.IdentityDocumentType;
import com.personalvault.service.vault.VaultIdentityDocumentService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/vault/identity-documents")
public class VaultIdentityDocumentController {

    private final VaultIdentityDocumentService identityService;

    public VaultIdentityDocumentController(VaultIdentityDocumentService identityService) {
        this.identityService = identityService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IdentityDocumentResponse> createIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute CreateIdentityDocumentRequest request) {
        IdentityDocumentResponse response = identityService.createIdentityDocument(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IdentityDocumentResponse>> getIdentityDocuments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) IdentityDocumentType type,
            @RequestParam(required = false) String search) {
        List<IdentityDocumentResponse> response = identityService.getIdentityDocuments(userDetails.getUsername(), type, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdentityDocumentResponse> getIdentityDocumentById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        IdentityDocumentResponse response = identityService.getIdentityDocumentById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IdentityDocumentResponse> updateIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateIdentityDocumentRequest request) {
        IdentityDocumentResponse response = identityService.updateIdentityDocument(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        identityService.deleteIdentityDocument(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reveal")
    public ResponseEntity<IdentityDocumentRevealResponse> revealIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        IdentityDocumentRevealResponse response = identityService.revealIdentityDocument(userDetails.getUsername(), id, vaultToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(defaultValue = "front") String side,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        IdentityDocumentResponse doc = identityService.getIdentityDocumentById(userDetails.getUsername(), id);
        Resource resource = identityService.getIdentityDocumentFileResource(userDetails.getUsername(), id, side, vaultToken);

        boolean isBack = "back".equalsIgnoreCase(side);
        String mime = isBack ? doc.getMimeTypeBack() : doc.getMimeTypeFront();
        String filename = isBack ? doc.getFileNameBack() : doc.getFileNameFront();

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(mime);
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(filename != null ? filename : "document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadIdentityDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(defaultValue = "front") String side,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        IdentityDocumentResponse doc = identityService.getIdentityDocumentById(userDetails.getUsername(), id);
        Resource resource = identityService.getIdentityDocumentFileResource(userDetails.getUsername(), id, side, vaultToken);

        boolean isBack = "back".equalsIgnoreCase(side);
        String mime = isBack ? doc.getMimeTypeBack() : doc.getMimeTypeFront();
        String filename = isBack ? doc.getFileNameBack() : doc.getFileNameFront();

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(mime);
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(filename != null ? filename : "document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
