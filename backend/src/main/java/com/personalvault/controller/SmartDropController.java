package com.personalvault.controller;

import com.personalvault.dto.*;
import com.personalvault.service.SmartDropService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/smartdrop")
public class SmartDropController {

    private final SmartDropService smartDropService;

    public SmartDropController(SmartDropService smartDropService) {
        this.smartDropService = smartDropService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<SmartDropAnalysisResponse>> analyzeFiles(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("files") List<MultipartFile> files) {
        List<SmartDropAnalysisResponse> response = smartDropService.analyzeFiles(userDetails.getUsername(), files);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/preview/{tempFileId}")
    public ResponseEntity<Resource> previewTempFile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tempFileId) {
        Resource fileResource = smartDropService.previewTempFile(userDetails.getUsername(), tempFileId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(fileResource);
    }

    @PostMapping("/confirm")
    public ResponseEntity<SmartDropConfirmResponse> confirm(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SmartDropConfirmRequest request,
            @RequestHeader(value = "X-Vault-Token", required = false) String vaultToken) {
        SmartDropConfirmResponse response = smartDropService.confirmAndRoute(userDetails.getUsername(), request, vaultToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm-batch")
    public ResponseEntity<SmartDropBatchConfirmResponse> confirmBatch(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SmartDropBatchConfirmRequest batchRequest,
            @RequestHeader(value = "X-Vault-Token", required = false) String vaultToken) {
        SmartDropBatchConfirmResponse response = smartDropService.confirmBatch(userDetails.getUsername(), batchRequest, vaultToken);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{tempFileId}")
    public ResponseEntity<Void> discardTempFile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String tempFileId) {
        smartDropService.discardTempFile(userDetails.getUsername(), tempFileId);
        return ResponseEntity.noContent().build();
    }
}
