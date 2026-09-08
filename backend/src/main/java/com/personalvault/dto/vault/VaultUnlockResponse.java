package com.personalvault.dto.vault;

public class VaultUnlockResponse {

    private String vaultToken;
    private long expiresInSeconds;

    public VaultUnlockResponse() {
    }

    public VaultUnlockResponse(String vaultToken, long expiresInSeconds) {
        this.vaultToken = vaultToken;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getVaultToken() {
        return vaultToken;
    }

    public void setVaultToken(String vaultToken) {
        this.vaultToken = vaultToken;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }
}
