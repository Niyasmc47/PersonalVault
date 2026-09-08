package com.personalvault.dto.vault;

public class VaultStatusResponse {

    private boolean configured;
    private boolean unlocked;
    private String passwordHint;
    private Integer autoLockMinutes;

    public VaultStatusResponse() {
    }

    public VaultStatusResponse(boolean configured, boolean unlocked, String passwordHint, Integer autoLockMinutes) {
        this.configured = configured;
        this.unlocked = unlocked;
        this.passwordHint = passwordHint;
        this.autoLockMinutes = autoLockMinutes;
    }

    public boolean isConfigured() {
        return configured;
    }

    public void setConfigured(boolean configured) {
        this.configured = configured;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public String getPasswordHint() {
        return passwordHint;
    }

    public void setPasswordHint(String passwordHint) {
        this.passwordHint = passwordHint;
    }

    public Integer getAutoLockMinutes() {
        return autoLockMinutes;
    }

    public void setAutoLockMinutes(Integer autoLockMinutes) {
        this.autoLockMinutes = autoLockMinutes;
    }
}
