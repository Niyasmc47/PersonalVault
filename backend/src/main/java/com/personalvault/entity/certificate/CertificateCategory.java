package com.personalvault.entity.certificate;

public enum CertificateCategory {
    COURSE("Course"),
    INTERNSHIP("Internship"),
    WORKSHOP("Workshop"),
    HACKATHON("Hackathon"),
    COMPETITION("Competition"),
    PROFESSIONAL("Professional"),
    ACADEMIC("Academic"),
    OTHER("Other");

    private final String displayName;

    CertificateCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
