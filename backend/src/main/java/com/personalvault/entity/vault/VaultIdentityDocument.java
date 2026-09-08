package com.personalvault.entity.vault;

import com.personalvault.entity.auth.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vault_identity_documents")
public class VaultIdentityDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdentityDocumentType type;

    @Column(nullable = false)
    private String holderName;

    @Column(nullable = false)
    private String maskedNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String encryptedDocumentNumber;

    @Column
    private LocalDate issueDate;

    @Column
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String encryptedNotes;

    // Front document file
    @Column
    private String driveFileIdFront;

    @Column
    private String fileNameFront;

    @Column
    private String mimeTypeFront;

    @Column
    private Long fileSizeFront;

    // Back document file
    @Column
    private String driveFileIdBack;

    @Column
    private String fileNameBack;

    @Column
    private String mimeTypeBack;

    @Column
    private Long fileSizeBack;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public VaultIdentityDocument() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getEncryptedDocumentNumber() {
        return encryptedDocumentNumber;
    }

    public void setEncryptedDocumentNumber(String encryptedDocumentNumber) {
        this.encryptedDocumentNumber = encryptedDocumentNumber;
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

    public String getEncryptedNotes() {
        return encryptedNotes;
    }

    public void setEncryptedNotes(String encryptedNotes) {
        this.encryptedNotes = encryptedNotes;
    }

    public String getDriveFileIdFront() {
        return driveFileIdFront;
    }

    public void setDriveFileIdFront(String driveFileIdFront) {
        this.driveFileIdFront = driveFileIdFront;
    }

    public String getFileNameFront() {
        return fileNameFront;
    }

    public void setFileNameFront(String fileNameFront) {
        this.fileNameFront = fileNameFront;
    }

    public String getMimeTypeFront() {
        return mimeTypeFront;
    }

    public void setMimeTypeFront(String mimeTypeFront) {
        this.mimeTypeFront = mimeTypeFront;
    }

    public Long getFileSizeFront() {
        return fileSizeFront;
    }

    public void setFileSizeFront(Long fileSizeFront) {
        this.fileSizeFront = fileSizeFront;
    }

    public String getDriveFileIdBack() {
        return driveFileIdBack;
    }

    public void setDriveFileIdBack(String driveFileIdBack) {
        this.driveFileIdBack = driveFileIdBack;
    }

    public String getFileNameBack() {
        return fileNameBack;
    }

    public void setFileNameBack(String fileNameBack) {
        this.fileNameBack = fileNameBack;
    }

    public String getMimeTypeBack() {
        return mimeTypeBack;
    }

    public void setMimeTypeBack(String mimeTypeBack) {
        this.mimeTypeBack = mimeTypeBack;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
