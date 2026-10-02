package com.personalvault.dto;

import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.model.ConfidenceLevel;
import com.personalvault.model.SmartDropClassification;
import com.personalvault.model.SmartDropDestination;

import java.util.Map;

public class SmartDropAnalysisResponse {
    private String tempFileId;
    private String fileName;
    private long fileSize;
    private String contentType;
    private SmartDropClassification classification;
    private SmartDropDestination suggestedDestination;
    private double confidence;
    private ConfidenceLevel confidenceLevel;
    private String explanation;
    private Map<String, Object> extractedMetadata;
    private ResumeContentDTO resumeData;
    private String textSnippet;
    private boolean duplicateWarning;
    private String duplicateMessage;
    private Long duplicateExistingId;

    public SmartDropAnalysisResponse() {}

    public String getTempFileId() {
        return tempFileId;
    }

    public void setTempFileId(String tempFileId) {
        this.tempFileId = tempFileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public SmartDropClassification getClassification() {
        return classification;
    }

    public void setClassification(SmartDropClassification classification) {
        this.classification = classification;
    }

    public SmartDropDestination getSuggestedDestination() {
        return suggestedDestination;
    }

    public void setSuggestedDestination(SmartDropDestination suggestedDestination) {
        this.suggestedDestination = suggestedDestination;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public ConfidenceLevel getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(ConfidenceLevel confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Map<String, Object> getExtractedMetadata() {
        return extractedMetadata;
    }

    public void setExtractedMetadata(Map<String, Object> extractedMetadata) {
        this.extractedMetadata = extractedMetadata;
    }

    public ResumeContentDTO getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeContentDTO resumeData) {
        this.resumeData = resumeData;
    }

    public String getTextSnippet() {
        return textSnippet;
    }

    public void setTextSnippet(String textSnippet) {
        this.textSnippet = textSnippet;
    }

    public boolean isDuplicateWarning() {
        return duplicateWarning;
    }

    public void setDuplicateWarning(boolean duplicateWarning) {
        this.duplicateWarning = duplicateWarning;
    }

    public String getDuplicateMessage() {
        return duplicateMessage;
    }

    public void setDuplicateMessage(String duplicateMessage) {
        this.duplicateMessage = duplicateMessage;
    }

    public Long getDuplicateExistingId() {
        return duplicateExistingId;
    }

    public void setDuplicateExistingId(Long duplicateExistingId) {
        this.duplicateExistingId = duplicateExistingId;
    }
}
