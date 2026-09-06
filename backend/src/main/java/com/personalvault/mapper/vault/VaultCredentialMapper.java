package com.personalvault.mapper.vault;

import com.personalvault.dto.vault.CredentialResponse;
import com.personalvault.dto.vault.CredentialRevealResponse;
import com.personalvault.entity.vault.VaultCredential;

public class VaultCredentialMapper {

    private VaultCredentialMapper() {
    }

    public static CredentialResponse toResponse(VaultCredential credential) {
        if (credential == null) return null;
        CredentialResponse response = new CredentialResponse();
        response.setId(credential.getId());
        response.setName(credential.getName());
        response.setUsername(credential.getUsername());
        response.setUrl(credential.getUrl());
        response.setCategory(credential.getCategory());
        response.setPasswordAvailable(credential.getEncryptedPassword() != null && !credential.getEncryptedPassword().isBlank());
        response.setNotesAvailable(credential.getEncryptedNotes() != null && !credential.getEncryptedNotes().isBlank());
        response.setApiKeysAvailable(credential.getEncryptedApiKeys() != null && !credential.getEncryptedApiKeys().isBlank());
        response.setRecoveryCodesAvailable(credential.getEncryptedRecoveryCodes() != null && !credential.getEncryptedRecoveryCodes().isBlank());
        response.setCreatedAt(credential.getCreatedAt());
        response.setUpdatedAt(credential.getUpdatedAt());
        return response;
    }

    public static CredentialRevealResponse toRevealResponse(VaultCredential credential, String decryptedPassword, String decryptedNotes, String decryptedApiKeys, String decryptedRecoveryCodes) {
        return new CredentialRevealResponse(
                credential.getId(),
                decryptedPassword,
                decryptedNotes,
                decryptedApiKeys,
                decryptedRecoveryCodes
        );
    }
}
