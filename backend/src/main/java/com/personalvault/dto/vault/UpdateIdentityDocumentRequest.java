package com.personalvault.dto.vault;

import com.personalvault.entity.vault.IdentityDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public class UpdateIdentityDocumentRequest {

    @NotNull(message = "Document type is required")
    private IdentityDocumentType type;

    @NotBlank(message = "Holder name is required")
    private String holderName;

    // Optional on update
    private String documentNumber;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    private String notes;

    private MultipartFile frontFile;

    private MultipartFile backFile;

    public UpdateIdentityDocumentRequest() {
    }

    public IdentityDocumentType getType() {
        return type;
    }

    public void setType(IdentityDocumentType type) {
        this.type = type;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
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

    public MultipartFile getFrontFile() {
        return frontFile;
    }

    public void setFrontFile(MultipartFile frontFile) {
        this.frontFile = frontFile;
    }

    public MultipartFile getBackFile() {
        return backFile;
    }

    public void setBackFile(MultipartFile backFile) {
        this.backFile = backFile;
    }
}
