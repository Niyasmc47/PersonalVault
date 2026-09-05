package com.personalvault.controller.certificate;

import com.personalvault.dto.certificate.*;
import com.personalvault.entity.certificate.CertificateCategory;
import com.personalvault.service.certificate.CertificateService;
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
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CertificateResponse> createCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute CreateCertificateRequest request) {
        CertificateResponse response = certificateService.createCertificate(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getCertificates(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) CertificateCategory category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ExpiryStatus expiryStatus) {
        List<CertificateResponse> certificates = certificateService.getCertificates(
                userDetails.getUsername(), category, search, expiryStatus);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificateById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        CertificateResponse response = certificateService.getCertificateById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCertificateRequest request) {
        CertificateResponse response = certificateService.updateCertificate(
                userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        certificateService.deleteCertificate(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        CertificateResponse details = certificateService.getCertificateEntityDetails(userDetails.getUsername(), id);
        Resource resource = certificateService.getCertificateFileResource(userDetails.getUsername(), id);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(details.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(details.getOriginalFileName(), StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        CertificateResponse details = certificateService.getCertificateEntityDetails(userDetails.getUsername(), id);
        Resource resource = certificateService.getCertificateFileResource(userDetails.getUsername(), id);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(details.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(details.getOriginalFileName(), StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @GetMapping("/summary")
    public ResponseEntity<CertificateSummaryDTO> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        CertificateSummaryDTO summary = certificateService.getSummary(userDetails.getUsername());
        return ResponseEntity.ok(summary);
    }
}
