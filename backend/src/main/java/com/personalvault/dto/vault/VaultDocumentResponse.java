package com.personalvault.dto.vault;

import com.personalvault.entity.vault.VaultDocumentCategory;
import com.personalvault.entity.vault.VaultDocumentSection;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class VaultDocumentResponse {

    private Long id;
    private VaultDocumentSection section;
    private VaultDocumentCategory category;
    private String title;
    private String issuerOrInstitution;
    private String documentIdentifier;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private boolean hasNotes;
    private String originalFileName;
    private String mimeType;
    private Long fileSize;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public VaultDocumentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VaultDocumentSection getSection() {
        return section;
    }

    public void setSection(VaultDocumentSection section) {
        this.section = section;
    }

    public VaultDocumentCategory getCategory() {
        return category;
    }

    public void setCategory(VaultDocumentCategory category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIssuerOrInstitution() {
        return issuerOrInstitution;
    }

    public void setIssuerOrInstitution(String issuerOrInstitution) {
        this.issuerOrInstitution = issuerOrInstitution;
    }

    public String getDocumentIdentifier() {
        return documentIdentifier;
    }

    public void setDocumentIdentifier(String documentIdentifier) {
        this.documentIdentifier = documentIdentifier;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isHasNotes() {
        return hasNotes;
    }

    public void setHasNotes(boolean hasNotes) {
        this.hasNotes = hasNotes;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
