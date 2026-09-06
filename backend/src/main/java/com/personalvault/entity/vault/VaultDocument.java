package com.personalvault.entity.vault;

import com.personalvault.entity.auth.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vault_documents")
public class VaultDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VaultDocumentSection section = VaultDocumentSection.EDUCATION;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VaultDocumentCategory category;

    @Column(nullable = false)
    private String title;

    @Column
    private String issuerOrInstitution;

    @Column
    private String documentIdentifier;

    @Column
    private LocalDate issueDate;

    @Column
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String encryptedNotes;

    @Column(nullable = false)
    private String googleDriveFileId;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String mimeType;

    @Column
    private Long fileSize;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public VaultDocument() {
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

    public String getEncryptedNotes() {
        return encryptedNotes;
    }

    public void setEncryptedNotes(String encryptedNotes) {
        this.encryptedNotes = encryptedNotes;
    }

    public String getGoogleDriveFileId() {
        return googleDriveFileId;
    }

    public void setGoogleDriveFileId(String googleDriveFileId) {
        this.googleDriveFileId = googleDriveFileId;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
