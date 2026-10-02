package com.personalvault.mapper;

import com.personalvault.dto.CredentialResponse;
import com.personalvault.dto.CredentialRevealResponse;
import com.personalvault.entity.VaultCredential;

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
