package com.personalvault.dto.vault;

import com.personalvault.entity.vault.FinancialAccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class UpdateFinancialAccountRequest {

    @NotBlank(message = "Bank or institution name is required")
    private String bankName;

    // Optional on update
    private String accountNumber;

    private String ifsc;

    private String branch;

    @NotNull(message = "Account type is required")
    private FinancialAccountType accountType = FinancialAccountType.SAVINGS;

    private String upiId;

    private String taxInfo;

    private String notes;

    private MultipartFile file;

    public UpdateFinancialAccountRequest() {
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfsc() {
        return ifsc;
    }

    public void setIfsc(String ifsc) {
        this.ifsc = ifsc;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public FinancialAccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(FinancialAccountType accountType) {
        this.accountType = accountType;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
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

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
