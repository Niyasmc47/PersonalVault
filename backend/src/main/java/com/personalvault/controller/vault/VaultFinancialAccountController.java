package com.personalvault.controller.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.vault.FinancialAccountType;
import com.personalvault.service.vault.VaultFinancialAccountService;
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
@RequestMapping("/api/vault/financial")
public class VaultFinancialAccountController {

    private final VaultFinancialAccountService financialService;

    public VaultFinancialAccountController(VaultFinancialAccountService financialService) {
        this.financialService = financialService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FinancialAccountResponse> createAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @ModelAttribute CreateFinancialAccountRequest request) {
        FinancialAccountResponse response = financialService.createAccount(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FinancialAccountResponse>> getAccounts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) FinancialAccountType accountType,
            @RequestParam(required = false) String search) {
        List<FinancialAccountResponse> response = financialService.getAccounts(userDetails.getUsername(), accountType, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialAccountResponse> getAccountById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        FinancialAccountResponse response = financialService.getAccountById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FinancialAccountResponse> updateAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateFinancialAccountRequest request) {
        FinancialAccountResponse response = financialService.updateAccount(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        financialService.deleteAccount(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reveal")
    public ResponseEntity<FinancialAccountRevealResponse> revealAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        FinancialAccountRevealResponse response = financialService.revealAccount(userDetails.getUsername(), id, vaultToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewAccountDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        FinancialAccountResponse account = financialService.getAccountById(userDetails.getUsername(), id);
        Resource resource = financialService.getAccountFileResource(userDetails.getUsername(), id, vaultToken);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(account.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(account.getFileName() != null ? account.getFileName() : "financial_document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadAccountDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        FinancialAccountResponse account = financialService.getAccountById(userDetails.getUsername(), id);
        Resource resource = financialService.getAccountFileResource(userDetails.getUsername(), id, vaultToken);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(account.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(account.getFileName() != null ? account.getFileName() : "financial_document", StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok().headers(headers).body(resource);
    }
}
