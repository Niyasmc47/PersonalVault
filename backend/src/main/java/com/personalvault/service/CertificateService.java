package com.personalvault.service;

import com.personalvault.dto.*;
import com.personalvault.entity.CertificateCategory;
import org.springframework.core.io.Resource;

import java.util.List;

public interface CertificateService {

    CertificateResponse createCertificate(String userEmail, CreateCertificateRequest request);

    List<CertificateResponse> getCertificates(String userEmail, CertificateCategory category, String search, ExpiryStatus expiryStatus);

    CertificateResponse getCertificateById(String userEmail, Long certificateId);

    CertificateResponse updateCertificate(String userEmail, Long certificateId, UpdateCertificateRequest request);

    void deleteCertificate(String userEmail, Long certificateId);

    byte[] getCertificateFileBytes(String userEmail, Long certificateId);

    Resource getCertificateFileResource(String userEmail, Long certificateId);

    CertificateResponse getCertificateEntityDetails(String userEmail, Long certificateId);

    CertificateSummaryDTO getSummary(String userEmail);
}
