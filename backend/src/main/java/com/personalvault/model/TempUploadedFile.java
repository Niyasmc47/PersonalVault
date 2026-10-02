package com.personalvault.model;

import java.io.File;
import java.time.Instant;

public class TempUploadedFile {
    private String tempId;
    private String userEmail;
    private String originalFilename;
    private String contentType;
    private long fileSizeBytes;
    private File tempFile;
    private Instant createdAt;
    private Instant expiresAt;
    private ExtractedContent extractedContent;
    private ClassificationResult classificationResult;

    public TempUploadedFile() {}

    public TempUploadedFile(String tempId, String userEmail, String originalFilename, String contentType, long fileSizeBytes, File tempFile, Instant createdAt, Instant expiresAt) {
        this.tempId = tempId;
        this.userEmail = userEmail;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSizeBytes = fileSizeBytes;
        this.tempFile = tempFile;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public String getTempId() {
        return tempId;
    }

    public void setTempId(String tempId) {
        this.tempId = tempId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public File getTempFile() {
        return tempFile;
    }

    public void setTempFile(File tempFile) {
        this.tempFile = tempFile;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public ExtractedContent getExtractedContent() {
        return extractedContent;
    }

    public void setExtractedContent(ExtractedContent extractedContent) {
        this.extractedContent = extractedContent;
    }

    public ClassificationResult getClassificationResult() {
        return classificationResult;
    }

    public void setClassificationResult(ClassificationResult classificationResult) {
        this.classificationResult = classificationResult;
    }
}
