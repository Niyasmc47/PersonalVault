package com.personalvault.controller.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.auth.User;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.service.vault.VaultSecurityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vault")
public class VaultAuthController {

    private final VaultSecurityService vaultSecurityService;
    private final UserRepository userRepository;

    public VaultAuthController(VaultSecurityService vaultSecurityService, UserRepository userRepository) {
        this.vaultSecurityService = vaultSecurityService;
        this.userRepository = userRepository;
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping("/status")
    public ResponseEntity<VaultStatusResponse> getVaultStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestHeader(value = "X-Vault-Token", required = false) String vaultToken) {
        User user = getUser(userDetails);
        boolean isConfigured = vaultSecurityService.isConfigured(user);
        boolean isUnlocked = isConfigured && vaultSecurityService.isUnlocked(vaultToken, user.getEmail());
        String hint = vaultSecurityService.getPasswordHint(user);
        Integer autoLock = vaultSecurityService.getAutoLockMinutes(user);

        return ResponseEntity.ok(new VaultStatusResponse(isConfigured, isUnlocked, hint, autoLock));
    }

    @PostMapping("/setup")
    public ResponseEntity<VaultUnlockResponse> setupMasterPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VaultSetupRequest request) {
        User user = getUser(userDetails);
        String token = vaultSecurityService.setupMasterPassword(
                user, request.getMasterPassword(), request.getConfirmPassword(), request.getPasswordHint());
        long expiresIn = (long) vaultSecurityService.getAutoLockMinutes(user) * 60;

        return new ResponseEntity<>(new VaultUnlockResponse(token, expiresIn), HttpStatus.CREATED);
    }

    @PostMapping("/unlock")
    public ResponseEntity<VaultUnlockResponse> unlockVault(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VaultUnlockRequest request) {
        User user = getUser(userDetails);
        String token = vaultSecurityService.unlockVault(user, request.getMasterPassword());
        long expiresIn = (long) vaultSecurityService.getAutoLockMinutes(user) * 60;

        return ResponseEntity.ok(new VaultUnlockResponse(token, expiresIn));
    }

    @PostMapping("/lock")
    public ResponseEntity<Void> lockVault() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changeMasterPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VaultChangePasswordRequest request) {
        User user = getUser(userDetails);
        vaultSecurityService.changeMasterPassword(
                user, request.getCurrentPassword(), request.getNewPassword(),
                request.getConfirmPassword(), request.getPasswordHint());

        return ResponseEntity.ok().build();
    }
}
