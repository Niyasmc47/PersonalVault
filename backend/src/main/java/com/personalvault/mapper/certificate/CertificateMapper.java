package com.personalvault.mapper.certificate;

import com.personalvault.dto.certificate.CertificateResponse;
import com.personalvault.dto.certificate.ExpiryStatus;
import com.personalvault.entity.certificate.Certificate;

import java.time.LocalDate;

public class CertificateMapper {

    private CertificateMapper() {
    }

    public static CertificateResponse toResponse(Certificate certificate) {
        if (certificate == null) {
            return null;
        }

        CertificateResponse response = new CertificateResponse();
        response.setId(certificate.getId());
        response.setTitle(certificate.getTitle());
        response.setIssuer(certificate.getIssuer());
        response.setDescription(certificate.getDescription());
        response.setCategory(certificate.getCategory());
        response.setCategoryDisplayName(certificate.getCategory() != null ? certificate.getCategory().getDisplayName() : null);
        response.setIssueDate(certificate.getIssueDate());
        response.setExpiryDate(certificate.getExpiryDate());
        response.setCredentialId(certificate.getCredentialId());
        response.setCredentialUrl(certificate.getCredentialUrl());
        response.setGoogleDriveFileId(certificate.getGoogleDriveFileId());
        response.setOriginalFileName(certificate.getOriginalFileName());
        response.setMimeType(certificate.getMimeType());
        response.setFileSize(certificate.getFileSize());
        
        ExpiryStatus status = calculateExpiryStatus(certificate.getExpiryDate());
        response.setExpiryStatus(status);
        response.setExpiryStatusDisplayName(status.getDisplayName());
        
        response.setCreatedAt(certificate.getCreatedAt());
        response.setUpdatedAt(certificate.getUpdatedAt());

        return response;
    }

    public static ExpiryStatus calculateExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) {
            return ExpiryStatus.NO_EXPIRATION;
        }
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) {
            return ExpiryStatus.EXPIRED;
        } else if (!expiryDate.isAfter(today.plusDays(30))) {
            return ExpiryStatus.EXPIRING_SOON;
        } else {
            return ExpiryStatus.ACTIVE;
        }
    }
}
