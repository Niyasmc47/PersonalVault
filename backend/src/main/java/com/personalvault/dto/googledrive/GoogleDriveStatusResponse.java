package com.personalvault.dto.googledrive;

import java.time.LocalDateTime;

public class GoogleDriveStatusResponse {

    private boolean connected;
    private String driveEmail;
    private LocalDateTime connectedAt;
    private long certificatesCount;

    public GoogleDriveStatusResponse() {
    }

    public GoogleDriveStatusResponse(boolean connected, String driveEmail, LocalDateTime connectedAt, long certificatesCount) {
        this.connected = connected;
        this.driveEmail = driveEmail;
        this.connectedAt = connectedAt;
        this.certificatesCount = certificatesCount;
    }

    public static GoogleDriveStatusResponse disconnected() {
        return new GoogleDriveStatusResponse(false, null, null, 0);
    }

    public static GoogleDriveStatusResponse connected(String driveEmail, LocalDateTime connectedAt, long certificatesCount) {
        return new GoogleDriveStatusResponse(true, driveEmail, connectedAt, certificatesCount);
    }

    public boolean isConnected() {
        return connected;
    }

    public void setConnected(boolean connected) {
        this.connected = connected;
    }

    public String getDriveEmail() {
        return driveEmail;
    }

    public void setDriveEmail(String driveEmail) {
        this.driveEmail = driveEmail;
    }

    public LocalDateTime getConnectedAt() {
        return connectedAt;
    }

    public void setConnectedAt(LocalDateTime connectedAt) {
        this.connectedAt = connectedAt;
    }

    public long getCertificatesCount() {
        return certificatesCount;
    }

    public void setCertificatesCount(long certificatesCount) {
        this.certificatesCount = certificatesCount;
    }
}
