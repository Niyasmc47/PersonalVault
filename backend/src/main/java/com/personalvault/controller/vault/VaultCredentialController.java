package com.personalvault.controller.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.vault.CredentialCategory;
import com.personalvault.service.vault.VaultCredentialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vault/credentials")
public class VaultCredentialController {

    private final VaultCredentialService credentialService;

    public VaultCredentialController(VaultCredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @PostMapping
    public ResponseEntity<CredentialResponse> createCredential(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCredentialRequest request) {
        CredentialResponse response = credentialService.createCredential(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getCredentials(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) CredentialCategory category,
            @RequestParam(required = false) String search) {
        List<CredentialResponse> response = credentialService.getCredentials(userDetails.getUsername(), category, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialResponse> getCredentialById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        CredentialResponse response = credentialService.getCredentialById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CredentialResponse> updateCredential(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCredentialRequest request) {
        CredentialResponse response = credentialService.updateCredential(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredential(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        credentialService.deleteCredential(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reveal")
    public ResponseEntity<CredentialRevealResponse> revealCredential(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestHeader("X-Vault-Token") String vaultToken) {
        CredentialRevealResponse response = credentialService.revealCredential(userDetails.getUsername(), id, vaultToken);
        return ResponseEntity.ok(response);
    }
}
