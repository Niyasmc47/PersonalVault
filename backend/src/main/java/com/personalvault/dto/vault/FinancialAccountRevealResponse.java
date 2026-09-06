package com.personalvault.dto.vault;

public class FinancialAccountRevealResponse {

    private Long id;
    private String accountNumber;
    private String taxInfo;
    private String notes;

    public FinancialAccountRevealResponse() {
    }

    public FinancialAccountRevealResponse(Long id, String accountNumber, String taxInfo, String notes) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.taxInfo = taxInfo;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getTaxInfo() {
        return taxInfo;
    }

    public void setTaxInfo(String taxInfo) {
        this.taxInfo = taxInfo;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
