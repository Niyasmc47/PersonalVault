package com.personalvault.dto.vault;

import jakarta.validation.constraints.NotBlank;

public class VaultUnlockRequest {

    @NotBlank(message = "Master password is required to unlock the vault")
    private String masterPassword;

    public VaultUnlockRequest() {
    }

    public String getMasterPassword() {
        return masterPassword;
    }

    public void setMasterPassword(String masterPassword) {
        this.masterPassword = masterPassword;
    }
}
