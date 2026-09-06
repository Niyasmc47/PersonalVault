package com.personalvault.dto.vault;

import com.personalvault.entity.vault.VaultDocumentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public class UpdateVaultDocumentRequest {

    @NotNull(message = "Document category is required")
    private VaultDocumentCategory category;

    @NotBlank(message = "Document title is required")
    private String title;

    private String issuerOrInstitution;

    private String documentIdentifier;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    private String notes;

    // Optional on update
    private MultipartFile file;

    public UpdateVaultDocumentRequest() {
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
