package com.personalvault.dto.vault;

import com.personalvault.entity.vault.IdentityDocumentType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class IdentityDocumentResponse {

    private Long id;
    private IdentityDocumentType type;
    private String holderName;
    private String maskedNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private boolean hasNotes;
    private boolean hasFrontFile;
    private boolean hasBackFile;
    private String fileNameFront;
    private String fileNameBack;
    private String mimeTypeFront;
    private String mimeTypeBack;
    private Long fileSizeFront;
    private Long fileSizeBack;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IdentityDocumentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMaskedNumber() {
        return maskedNumber;
    }

    public void setMaskedNumber(String maskedNumber) {
        this.maskedNumber = maskedNumber;
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

    public boolean isHasFrontFile() {
        return hasFrontFile;
    }

    public void setHasFrontFile(boolean hasFrontFile) {
        this.hasFrontFile = hasFrontFile;
    }

    public boolean isHasBackFile() {
        return hasBackFile;
    }

    public void setHasBackFile(boolean hasBackFile) {
        this.hasBackFile = hasBackFile;
    }

    public String getFileNameFront() {
        return fileNameFront;
    }

    public void setFileNameFront(String fileNameFront) {
        this.fileNameFront = fileNameFront;
    }

    public String getFileNameBack() {
        return fileNameBack;
    }

    public void setFileNameBack(String fileNameBack) {
        this.fileNameBack = fileNameBack;
    }

    public String getMimeTypeFront() {
        return mimeTypeFront;
    }

    public void setMimeTypeFront(String mimeTypeFront) {
        this.mimeTypeFront = mimeTypeFront;
    }

    public String getMimeTypeBack() {
        return mimeTypeBack;
    }

    public void setMimeTypeBack(String mimeTypeBack) {
        this.mimeTypeBack = mimeTypeBack;
    }

    public Long getFileSizeFront() {
        return fileSizeFront;
    }

    public void setFileSizeFront(Long fileSizeFront) {
        this.fileSizeFront = fileSizeFront;
    }

    public Long getFileSizeBack() {
        return fileSizeBack;
    }

    public void setFileSizeBack(Long fileSizeBack) {
        this.fileSizeBack = fileSizeBack;
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
