package com.personalvault.controller.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.vault.VaultDocumentCategory;
import com.personalvault.entity.vault.VaultDocumentSection;
import com.personalvault.service.vault.VaultDocumentService;
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
@RequestMapping("/api/vault/documents")
public class VaultDocumentController {

    private final VaultDocumentService documentService;

    public VaultDocumentController(VaultDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VaultDocumentResponse> createDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute CreateVaultDocumentRequest request) {
        VaultDocumentResponse response = documentService.createDocument(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VaultDocumentResponse>> getDocuments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "EDUCATION") VaultDocumentSection section,
            @RequestParam(required = false) VaultDocumentCategory category,
            @RequestParam(required = false) String search) {
        List<VaultDocumentResponse> response = documentService.getDocuments(userDetails.getUsername(), section, category, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaultDocumentResponse> getDocumentById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        VaultDocumentResponse response = documentService.getDocumentById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VaultDocumentResponse> updateDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateVaultDocumentRequest request) {
        VaultDocumentResponse response = documentService.updateDocument(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        documentService.deleteDocument(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reveal")
    public ResponseEntity<VaultDocumentRevealResponse> revealDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        VaultDocumentRevealResponse response = documentService.revealDocument(userDetails.getUsername(), id, vaultToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        VaultDocumentResponse doc = documentService.getDocumentById(userDetails.getUsername(), id);
        Resource resource = documentService.getDocumentFileResource(userDetails.getUsername(), id, vaultToken);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(doc.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(doc.getOriginalFileName() != null ? doc.getOriginalFileName() : "document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        VaultDocumentResponse doc = documentService.getDocumentById(userDetails.getUsername(), id);
        Resource resource = documentService.getDocumentFileResource(userDetails.getUsername(), id, vaultToken);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(doc.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(doc.getOriginalFileName() != null ? doc.getOriginalFileName() : "document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
