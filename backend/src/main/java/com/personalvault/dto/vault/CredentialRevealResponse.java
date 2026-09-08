package com.personalvault.dto.vault;

public class CredentialRevealResponse {

    private Long id;
    private String password;
    private String notes;
    private String apiKeys;
    private String recoveryCodes;

    public CredentialRevealResponse() {
    }

    public CredentialRevealResponse(Long id, String password, String notes, String apiKeys, String recoveryCodes) {
        this.id = id;
        this.password = password;
        this.notes = notes;
        this.apiKeys = apiKeys;
        this.recoveryCodes = recoveryCodes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getApiKeys() {
        return apiKeys;
    }

    public void setApiKeys(String apiKeys) {
        this.apiKeys = apiKeys;
    }

    public String getRecoveryCodes() {
        return recoveryCodes;
    }

    public void setRecoveryCodes(String recoveryCodes) {
        this.recoveryCodes = recoveryCodes;
    }
}
