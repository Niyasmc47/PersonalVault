package com.personalvault.mapper.vault;

import com.personalvault.dto.vault.FinancialAccountResponse;
import com.personalvault.dto.vault.FinancialAccountRevealResponse;
import com.personalvault.entity.vault.VaultFinancialAccount;

public class VaultFinancialAccountMapper {

    private VaultFinancialAccountMapper() {
    }

    public static FinancialAccountResponse toResponse(VaultFinancialAccount account) {
        if (account == null) return null;
        FinancialAccountResponse response = new FinancialAccountResponse();
        response.setId(account.getId());
        response.setBankName(account.getBankName());
        response.setMaskedAccountNumber(account.getMaskedAccountNumber());
        response.setIfsc(account.getIfsc());
        response.setBranch(account.getBranch());
        response.setAccountType(account.getAccountType());
        response.setUpiId(account.getUpiId());
        response.setHasTaxInfo(account.getEncryptedTaxInfo() != null && !account.getEncryptedTaxInfo().isBlank());
        response.setHasNotes(account.getEncryptedNotes() != null && !account.getEncryptedNotes().isBlank());
        response.setHasDocument(account.getDriveFileId() != null && !account.getDriveFileId().isBlank());
        response.setFileName(account.getFileName());
        response.setMimeType(account.getMimeType());
        response.setFileSize(account.getFileSize());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }

    public static FinancialAccountRevealResponse toRevealResponse(VaultFinancialAccount account, String decryptedAccountNumber, String decryptedTaxInfo, String decryptedNotes) {
        return new FinancialAccountRevealResponse(
                account.getId(),
                decryptedAccountNumber,
                decryptedTaxInfo,
                decryptedNotes
        );
    }
}
