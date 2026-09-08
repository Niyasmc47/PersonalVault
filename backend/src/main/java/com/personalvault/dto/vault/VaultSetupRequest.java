package com.personalvault.dto.vault;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VaultSetupRequest {

    @NotBlank(message = "Master password is required")
    @Size(min = 6, message = "Master password must be at least 6 characters")
    private String masterPassword;

    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;

    private String passwordHint;

    public VaultSetupRequest() {
    }

    public String getMasterPassword() {
        return masterPassword;
    }

    public void setMasterPassword(String masterPassword) {
        this.masterPassword = masterPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPasswordHint() {
        return passwordHint;
    }

    public void setPasswordHint(String passwordHint) {
        this.passwordHint = passwordHint;
    }
}
