package com.personalvault.service.vault;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.VaultSettings;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.repository.vault.VaultSettingsRepository;
import com.personalvault.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class VaultSecurityService {

    private final VaultSettingsRepository vaultSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.vault.session-expiration-minutes:15}")
    private int defaultExpirationMinutes;

    public VaultSecurityService(VaultSettingsRepository vaultSettingsRepository,
                                PasswordEncoder passwordEncoder,
                                JwtService jwtService) {
        this.vaultSettingsRepository = vaultSettingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public boolean isConfigured(User user) {
        return vaultSettingsRepository.existsByUser(user);
    }

    public String getPasswordHint(User user) {
        return vaultSettingsRepository.findByUser(user)
                .map(VaultSettings::getPasswordHint)
                .orElse(null);
    }

    public Integer getAutoLockMinutes(User user) {
        return vaultSettingsRepository.findByUser(user)
                .map(VaultSettings::getAutoLockMinutes)
                .orElse(defaultExpirationMinutes);
    }

    public boolean isUnlocked(String vaultToken, String userEmail) {
        if (vaultToken == null || vaultToken.isBlank() || userEmail == null) {
            return false;
        }
        return jwtService.isVaultSessionTokenValid(vaultToken, userEmail);
    }

    public void requireUnlocked(String vaultToken, String userEmail) {
        if (!isUnlocked(vaultToken, userEmail)) {
            throw new UnauthorizedAccessException("Secure Vault is locked. Please unlock the vault first.");
        }
    }

    @Transactional
    public String setupMasterPassword(User user, String masterPassword, String confirmPassword, String passwordHint) {
        if (isConfigured(user)) {
            throw new InvalidRequestException("Master Vault Password is already set up. Use change password instead.");
        }
        if (masterPassword == null || masterPassword.length() < 6) {
            throw new InvalidRequestException("Master password must be at least 6 characters long.");
        }
        if (!masterPassword.equals(confirmPassword)) {
            throw new InvalidRequestException("Passwords do not match.");
        }

        String hash = passwordEncoder.encode(masterPassword);
        VaultSettings settings = new VaultSettings(user, hash, passwordHint != null ? passwordHint.trim() : null);
        settings.setAutoLockMinutes(defaultExpirationMinutes);
        vaultSettingsRepository.save(settings);

        long expirationMillis = (long) defaultExpirationMinutes * 60 * 1000;
        return jwtService.generateVaultSessionToken(user.getEmail(), expirationMillis);
    }

    public String unlockVault(User user, String masterPassword) {
        Optional<VaultSettings> settingsOpt = vaultSettingsRepository.findByUser(user);
        if (settingsOpt.isEmpty()) {
            throw new InvalidRequestException("Secure Vault is not yet set up. Please create your master password first.");
        }

        VaultSettings settings = settingsOpt.get();
        if (!passwordEncoder.matches(masterPassword, settings.getMasterPasswordHash())) {
            throw new BadCredentialsException("Invalid master vault password.");
        }

        int minutes = settings.getAutoLockMinutes() != null && settings.getAutoLockMinutes() > 0
                ? settings.getAutoLockMinutes()
                : defaultExpirationMinutes;

        long expirationMillis = (long) minutes * 60 * 1000;
        return jwtService.generateVaultSessionToken(user.getEmail(), expirationMillis);
    }

    @Transactional
    public void changeMasterPassword(User user, String currentPassword, String newPassword, String confirmPassword, String newHint) {
        VaultSettings settings = vaultSettingsRepository.findByUser(user)
                .orElseThrow(() -> new InvalidRequestException("Secure Vault is not yet set up."));

        if (!passwordEncoder.matches(currentPassword, settings.getMasterPasswordHash())) {
            throw new BadCredentialsException("Current master password is incorrect.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new InvalidRequestException("New password must be at least 6 characters long.");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new InvalidRequestException("New passwords do not match.");
        }

        settings.setMasterPasswordHash(passwordEncoder.encode(newPassword));
        if (newHint != null) {
            settings.setPasswordHint(newHint.trim());
        }
        vaultSettingsRepository.save(settings);
    }
}
