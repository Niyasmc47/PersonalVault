package com.personalvault.dto.vault;

public class VaultDocumentRevealResponse {

    private Long id;
    private String notes;

    public VaultDocumentRevealResponse() {
    }

    public VaultDocumentRevealResponse(Long id, String notes) {
        this.id = id;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
