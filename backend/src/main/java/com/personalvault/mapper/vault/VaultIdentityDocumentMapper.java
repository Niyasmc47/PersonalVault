package com.personalvault.mapper.vault;

import com.personalvault.dto.vault.IdentityDocumentResponse;
import com.personalvault.dto.vault.IdentityDocumentRevealResponse;
import com.personalvault.entity.vault.VaultIdentityDocument;

public class VaultIdentityDocumentMapper {

    private VaultIdentityDocumentMapper() {
    }

    public static IdentityDocumentResponse toResponse(VaultIdentityDocument doc) {
        if (doc == null) return null;
        IdentityDocumentResponse response = new IdentityDocumentResponse();
        response.setId(doc.getId());
        response.setType(doc.getType());
        response.setHolderName(doc.getHolderName());
        response.setMaskedNumber(doc.getMaskedNumber());
        response.setIssueDate(doc.getIssueDate());
        response.setExpiryDate(doc.getExpiryDate());
        response.setHasNotes(doc.getEncryptedNotes() != null && !doc.getEncryptedNotes().isBlank());
        response.setHasFrontFile(doc.getDriveFileIdFront() != null && !doc.getDriveFileIdFront().isBlank());
        response.setHasBackFile(doc.getDriveFileIdBack() != null && !doc.getDriveFileIdBack().isBlank());
        response.setFileNameFront(doc.getFileNameFront());
        response.setFileNameBack(doc.getFileNameBack());
        response.setMimeTypeFront(doc.getMimeTypeFront());
        response.setMimeTypeBack(doc.getMimeTypeBack());
        response.setFileSizeFront(doc.getFileSizeFront());
        response.setFileSizeBack(doc.getFileSizeBack());
        response.setCreatedAt(doc.getCreatedAt());
        response.setUpdatedAt(doc.getUpdatedAt());
        return response;
    }

    public static IdentityDocumentRevealResponse toRevealResponse(VaultIdentityDocument doc, String decryptedNumber, String decryptedNotes) {
        return new IdentityDocumentRevealResponse(doc.getId(), decryptedNumber, decryptedNotes);
    }
}
