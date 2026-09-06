package com.personalvault.dto.vault;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VaultChangePasswordRequest {

    @NotBlank(message = "Current master password is required")
    private String currentPassword;

    @NotBlank(message = "New master password is required")
    @Size(min = 6, message = "New master password must be at least 6 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    private String passwordHint;

    public VaultChangePasswordRequest() {
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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
