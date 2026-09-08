package com.personalvault.service.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.CredentialCategory;
import com.personalvault.entity.vault.VaultCredential;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.vault.VaultCredentialMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.vault.VaultCredentialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VaultCredentialService {

    private final VaultCredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final VaultSecurityService vaultSecurityService;

    public VaultCredentialService(VaultCredentialRepository credentialRepository,
                                  UserRepository userRepository,
                                  EncryptionService encryptionService,
                                  VaultSecurityService vaultSecurityService) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.vaultSecurityService = vaultSecurityService;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public CredentialResponse createCredential(String userEmail, CreateCredentialRequest request) {
        User user = getAuthenticatedUser(userEmail);

        VaultCredential credential = new VaultCredential();
        credential.setUser(user);
        credential.setName(request.getName().trim());
        credential.setUsername(request.getUsername().trim());
        credential.setEncryptedPassword(encryptionService.encrypt(request.getPassword()));
        credential.setUrl(request.getUrl() != null ? request.getUrl().trim() : null);
        credential.setCategory(request.getCategory());
        credential.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);
        credential.setEncryptedApiKeys(request.getApiKeys() != null && !request.getApiKeys().isBlank()
                ? encryptionService.encrypt(request.getApiKeys().trim()) : null);
        credential.setEncryptedRecoveryCodes(request.getRecoveryCodes() != null && !request.getRecoveryCodes().isBlank()
                ? encryptionService.encrypt(request.getRecoveryCodes().trim()) : null);

        VaultCredential saved = credentialRepository.save(credential);
        return VaultCredentialMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CredentialResponse> getCredentials(String userEmail, CredentialCategory category, String search) {
        User user = getAuthenticatedUser(userEmail);

        List<VaultCredential> list;
        if (search != null && !search.isBlank()) {
            list = credentialRepository.searchCredentials(user, search.trim());
            if (category != null) {
                list = list.stream().filter(c -> c.getCategory() == category).collect(Collectors.toList());
            }
        } else if (category != null) {
            list = credentialRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, category);
        } else {
            list = credentialRepository.findByUserOrderByCreatedAtDesc(user);
        }

        return list.stream()
                .map(VaultCredentialMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CredentialResponse getCredentialById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultCredential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credential not found with ID: " + id));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to view this credential.");
        }

        return VaultCredentialMapper.toResponse(credential);
    }

    @Transactional
    public CredentialResponse updateCredential(String userEmail, Long id, UpdateCredentialRequest request) {
        User user = getAuthenticatedUser(userEmail);
        VaultCredential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credential not found with ID: " + id));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this credential.");
        }

        credential.setName(request.getName().trim());
        credential.setUsername(request.getUsername().trim());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            credential.setEncryptedPassword(encryptionService.encrypt(request.getPassword()));
        }
        credential.setUrl(request.getUrl() != null ? request.getUrl().trim() : null);
        credential.setCategory(request.getCategory());
        credential.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);
        credential.setEncryptedApiKeys(request.getApiKeys() != null && !request.getApiKeys().isBlank()
                ? encryptionService.encrypt(request.getApiKeys().trim()) : null);
        credential.setEncryptedRecoveryCodes(request.getRecoveryCodes() != null && !request.getRecoveryCodes().isBlank()
                ? encryptionService.encrypt(request.getRecoveryCodes().trim()) : null);

        VaultCredential updated = credentialRepository.save(credential);
        return VaultCredentialMapper.toResponse(updated);
    }

    @Transactional
    public void deleteCredential(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultCredential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credential not found with ID: " + id));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this credential.");
        }

        credentialRepository.delete(credential);
    }

    @Transactional(readOnly = true)
    public CredentialRevealResponse revealCredential(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultCredential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Credential not found with ID: " + id));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to reveal this credential.");
        }

        String plainPassword = encryptionService.decrypt(credential.getEncryptedPassword());
        String plainNotes = encryptionService.decrypt(credential.getEncryptedNotes());
        String plainApiKeys = encryptionService.decrypt(credential.getEncryptedApiKeys());
        String plainRecoveryCodes = encryptionService.decrypt(credential.getEncryptedRecoveryCodes());

        return VaultCredentialMapper.toRevealResponse(credential, plainPassword, plainNotes, plainApiKeys, plainRecoveryCodes);
    }
}
