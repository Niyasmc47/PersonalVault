package com.personalvault.dto.vault;

public class IdentityDocumentRevealResponse {

    private Long id;
    private String documentNumber;
    private String notes;

    public IdentityDocumentRevealResponse() {
    }

    public IdentityDocumentRevealResponse(Long id, String documentNumber, String notes) {
        this.id = id;
        this.documentNumber = documentNumber;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
