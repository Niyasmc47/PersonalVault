package com.personalvault.dto;

import java.util.List;

public class SmartDropBatchConfirmRequest {
    private List<SmartDropConfirmRequest> confirmations;

    public SmartDropBatchConfirmRequest() {}

    public List<SmartDropConfirmRequest> getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(List<SmartDropConfirmRequest> confirmations) {
        this.confirmations = confirmations;
    }
}
