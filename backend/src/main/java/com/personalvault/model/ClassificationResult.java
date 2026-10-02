package com.personalvault.model;

import com.personalvault.dto.ResumeContentDTO;

import java.util.HashMap;
import java.util.Map;

public class ClassificationResult {
    private SmartDropClassification classification = SmartDropClassification.UNKNOWN;
    private SmartDropDestination suggestedDestination = SmartDropDestination.UNKNOWN;
    private double confidence = 0.0;
    private ConfidenceLevel confidenceLevel = ConfidenceLevel.LOW;
    private String explanation = "";
    private Map<String, Object> extractedFields = new HashMap<>();
    private ResumeContentDTO resumeData;
    private boolean duplicate = false;
    private String duplicateMessage;
    private Long duplicateExistingId;

    public ClassificationResult() {}

    public static ConfidenceLevel calculateConfidenceLevel(double confidence) {
        if (confidence >= 0.95) return ConfidenceLevel.VERY_HIGH;
        if (confidence >= 0.80) return ConfidenceLevel.HIGH;
        if (confidence >= 0.60) return ConfidenceLevel.MEDIUM;
        return ConfidenceLevel.LOW;
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
        this.confidenceLevel = calculateConfidenceLevel(confidence);
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

    public Map<String, Object> getExtractedFields() {
        return extractedFields;
    }

    public void setExtractedFields(Map<String, Object> extractedFields) {
        this.extractedFields = extractedFields;
    }

    public ResumeContentDTO getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeContentDTO resumeData) {
        this.resumeData = resumeData;
    }

    public boolean isDuplicate() {
        return duplicate;
    }

    public void setDuplicate(boolean duplicate) {
        this.duplicate = duplicate;
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
