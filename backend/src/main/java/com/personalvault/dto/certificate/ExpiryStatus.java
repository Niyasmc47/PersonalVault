package com.personalvault.dto.certificate;

public enum ExpiryStatus {
    ACTIVE("Active"),
    EXPIRING_SOON("Expiring Soon"),
    EXPIRED("Expired"),
    NO_EXPIRATION("No Expiration");

    private final String displayName;

    ExpiryStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
