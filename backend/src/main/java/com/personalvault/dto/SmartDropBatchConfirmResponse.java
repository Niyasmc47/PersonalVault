package com.personalvault.dto;

import java.util.List;

public class SmartDropBatchConfirmResponse {
    private int totalProcessed;
    private int successCount;
    private int failureCount;
    private List<SmartDropConfirmResponse> results;

    public SmartDropBatchConfirmResponse() {}

    public SmartDropBatchConfirmResponse(int totalProcessed, int successCount, int failureCount, List<SmartDropConfirmResponse> results) {
        this.totalProcessed = totalProcessed;
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.results = results;
    }

    public int getTotalProcessed() {
        return totalProcessed;
    }

    public void setTotalProcessed(int totalProcessed) {
        this.totalProcessed = totalProcessed;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public List<SmartDropConfirmResponse> getResults() {
        return results;
    }

    public void setResults(List<SmartDropConfirmResponse> results) {
        this.results = results;
    }
}
