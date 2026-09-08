package com.personalvault.entity.vault;

import com.personalvault.entity.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vault_financial_accounts")
public class VaultFinancialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String bankName;

    @Column(nullable = false)
    private String maskedAccountNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String encryptedAccountNumber;

    @Column
    private String ifsc;

    @Column
    private String branch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinancialAccountType accountType = FinancialAccountType.SAVINGS;

    @Column
    private String upiId;

    @Column(columnDefinition = "TEXT")
    private String encryptedTaxInfo;

    @Column(columnDefinition = "TEXT")
    private String encryptedNotes;

    // Optional document attachment (e.g., passbook, statement, cheque)
    @Column
    private String driveFileId;

    @Column
    private String fileName;

    @Column
    private String mimeType;

    @Column
    private Long fileSize;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public VaultFinancialAccount() {
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

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getMaskedAccountNumber() {
        return maskedAccountNumber;
    }

    public void setMaskedAccountNumber(String maskedAccountNumber) {
        this.maskedAccountNumber = maskedAccountNumber;
    }

    public String getEncryptedAccountNumber() {
        return encryptedAccountNumber;
    }

    public void setEncryptedAccountNumber(String encryptedAccountNumber) {
        this.encryptedAccountNumber = encryptedAccountNumber;
    }

    public String getIfsc() {
        return ifsc;
    }

    public void setIfsc(String ifsc) {
        this.ifsc = ifsc;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public FinancialAccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(FinancialAccountType accountType) {
        this.accountType = accountType;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getEncryptedTaxInfo() {
        return encryptedTaxInfo;
    }

    public void setEncryptedTaxInfo(String encryptedTaxInfo) {
        this.encryptedTaxInfo = encryptedTaxInfo;
    }

    public String getEncryptedNotes() {
        return encryptedNotes;
    }

    public void setEncryptedNotes(String encryptedNotes) {
        this.encryptedNotes = encryptedNotes;
    }

    public String getDriveFileId() {
        return driveFileId;
    }

    public void setDriveFileId(String driveFileId) {
        this.driveFileId = driveFileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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
