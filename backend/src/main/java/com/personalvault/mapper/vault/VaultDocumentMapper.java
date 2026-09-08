package com.personalvault.mapper.vault;

import com.personalvault.dto.vault.VaultDocumentResponse;
import com.personalvault.dto.vault.VaultDocumentRevealResponse;
import com.personalvault.entity.vault.VaultDocument;

public class VaultDocumentMapper {

    private VaultDocumentMapper() {
    }

    public static VaultDocumentResponse toResponse(VaultDocument doc) {
        if (doc == null) return null;
        VaultDocumentResponse response = new VaultDocumentResponse();
        response.setId(doc.getId());
        response.setSection(doc.getSection());
        response.setCategory(doc.getCategory());
        response.setTitle(doc.getTitle());
        response.setIssuerOrInstitution(doc.getIssuerOrInstitution());
        response.setDocumentIdentifier(doc.getDocumentIdentifier());
        response.setIssueDate(doc.getIssueDate());
        response.setExpiryDate(doc.getExpiryDate());
        response.setHasNotes(doc.getEncryptedNotes() != null && !doc.getEncryptedNotes().isBlank());
        response.setOriginalFileName(doc.getOriginalFileName());
        response.setMimeType(doc.getMimeType());
        response.setFileSize(doc.getFileSize());
        response.setCreatedAt(doc.getCreatedAt());
        response.setUpdatedAt(doc.getUpdatedAt());
        return response;
    }

    public static VaultDocumentRevealResponse toRevealResponse(VaultDocument doc, String decryptedNotes) {
        return new VaultDocumentRevealResponse(doc.getId(), decryptedNotes);
    }
}
