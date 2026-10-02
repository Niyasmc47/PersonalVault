package com.personalvault.model;

import java.util.HashMap;
import java.util.Map;

public class ExtractedContent {
    private String fullText = "";
    private String rawSnippet = "";
    private int pageCount = 1;
    private boolean hasImages = false;
    private String contentHash = "";
    private Map<String, Object> technicalMetadata = new HashMap<>();

    public ExtractedContent() {}

    public ExtractedContent(String fullText, String rawSnippet, int pageCount, boolean hasImages, String contentHash) {
        this.fullText = fullText != null ? fullText : "";
        this.rawSnippet = rawSnippet != null ? rawSnippet : "";
        this.pageCount = pageCount;
        this.hasImages = hasImages;
        this.contentHash = contentHash != null ? contentHash : "";
    }

    public String getFullText() {
        return fullText;
    }

    public void setFullText(String fullText) {
        this.fullText = fullText;
    }

    public String getRawSnippet() {
        return rawSnippet;
    }

    public void setRawSnippet(String rawSnippet) {
        this.rawSnippet = rawSnippet;
    }

    public int getPageCount() {
        return pageCount;
    }

    public void setPageCount(int pageCount) {
        this.pageCount = pageCount;
    }

    public boolean isHasImages() {
        return hasImages;
    }

    public void setHasImages(boolean hasImages) {
        this.hasImages = hasImages;
    }

    public String getContentHash() {
        return contentHash;
    }

    public void setContentHash(String contentHash) {
        this.contentHash = contentHash;
    }

    public Map<String, Object> getTechnicalMetadata() {
        return technicalMetadata;
    }

    public void setTechnicalMetadata(Map<String, Object> technicalMetadata) {
        this.technicalMetadata = technicalMetadata;
    }
}
