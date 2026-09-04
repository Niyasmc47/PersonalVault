package com.personalvault.service.certificate;

import com.personalvault.dto.certificate.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.certificate.Certificate;
import com.personalvault.entity.certificate.CertificateCategory;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.certificate.CertificateMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.certificate.CertificateRepository;
import com.personalvault.service.googledrive.GoogleDriveService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final GoogleDriveService googleDriveService;

    @Value("${app.certificates.max-file-size:20971520}") // Default 20 MB
    private long maxFileSizeBytes;

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "png", "jpg", "jpeg", "webp"
    );

    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  GoogleDriveService googleDriveService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.googleDriveService = googleDriveService;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public CertificateResponse createCertificate(String userEmail, CreateCertificateRequest request) {
        User user = getAuthenticatedUser(userEmail);

        if (!googleDriveService.isConnected(user)) {
            throw new InvalidRequestException("Google Drive is not connected. Please connect Google Drive before uploading certificates.");
        }

        MultipartFile file = request.getFile();
        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "certificate";
        }
        String mimeType = normalizeMimeType(file.getContentType(), originalFileName);

        String driveFileId = null;
        try {
            // Upload to user's Google Drive inside PersonalVault/Certificates
            driveFileId = googleDriveService.uploadCertificateFile(user, file, originalFileName);

            Certificate certificate = new Certificate();
            certificate.setUser(user);
            certificate.setTitle(request.getTitle().trim());
            certificate.setIssuer(request.getIssuer().trim());
            certificate.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
            certificate.setCategory(request.getCategory());
            certificate.setIssueDate(request.getIssueDate());
            certificate.setExpiryDate(request.getExpiryDate());
            certificate.setCredentialId(request.getCredentialId() != null ? request.getCredentialId().trim() : null);
            certificate.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);
            certificate.setGoogleDriveFileId(driveFileId);
            certificate.setOriginalFileName(originalFileName);
            certificate.setMimeType(mimeType);
            certificate.setFileSize(file.getSize());

            Certificate saved = certificateRepository.save(certificate);
            return CertificateMapper.toResponse(saved);

        } catch (Exception e) {
            // Rollback / compensation: clean up uploaded Google Drive file if DB save fails
            if (driveFileId != null) {
                try {
                    googleDriveService.deleteFile(user, driveFileId);
                } catch (Exception ignored) {
                }
            }
            if (e instanceof InvalidRequestException) {
                throw (InvalidRequestException) e;
            }
            throw new InvalidRequestException("Failed to save certificate: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificates(String userEmail, CertificateCategory category, String search, ExpiryStatus expiryStatus) {
        User user = getAuthenticatedUser(userEmail);

        List<Certificate> certificates;
        if (search != null && !search.isBlank()) {
            certificates = certificateRepository.searchCertificates(user, search.trim());
        } else if (category != null) {
            certificates = certificateRepository.findByUserAndCategoryOrderByIssueDateDesc(user, category);
        } else {
            certificates = certificateRepository.findByUserOrderByIssueDateDesc(user);
        }

        return certificates.stream()
                .filter(cert -> {
                    if (category != null && search != null && !search.isBlank()) {
                        if (cert.getCategory() != category) return false;
                    }
                    if (expiryStatus != null) {
                        ExpiryStatus calculated = CertificateMapper.calculateExpiryStatus(cert.getExpiryDate());
                        if (calculated != expiryStatus) return false;
                    }
                    return true;
                })
                .map(CertificateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(String userEmail, Long certificateId) {
        User user = getAuthenticatedUser(userEmail);
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + certificateId));

        if (!certificate.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to view this certificate");
        }

        return CertificateMapper.toResponse(certificate);
    }

    @Override
    @Transactional
    public CertificateResponse updateCertificate(String userEmail, Long certificateId, UpdateCertificateRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + certificateId));

        if (!certificate.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to modify this certificate");
        }

        certificate.setTitle(request.getTitle().trim());
        certificate.setIssuer(request.getIssuer().trim());
        certificate.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        certificate.setCategory(request.getCategory());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setCredentialId(request.getCredentialId() != null ? request.getCredentialId().trim() : null);
        certificate.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);

        Certificate updated = certificateRepository.save(certificate);
        return CertificateMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCertificate(String userEmail, Long certificateId) {
        User user = getAuthenticatedUser(userEmail);
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + certificateId));

        if (!certificate.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this certificate");
        }

        String driveFileId = certificate.getGoogleDriveFileId();
        
        // Delete from database first
        certificateRepository.delete(certificate);

        // Then delete from Google Drive
        if (driveFileId != null && !driveFileId.isBlank()) {
            googleDriveService.deleteFile(user, driveFileId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getCertificateFileBytes(String userEmail, Long certificateId) {
        User user = getAuthenticatedUser(userEmail);
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + certificateId));

        if (!certificate.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this certificate file");
        }

        return googleDriveService.downloadFileBytes(user, certificate.getGoogleDriveFileId());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource getCertificateFileResource(String userEmail, Long certificateId) {
        byte[] bytes = getCertificateFileBytes(userEmail, certificateId);
        return new ByteArrayResource(bytes);
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateEntityDetails(String userEmail, Long certificateId) {
        return getCertificateById(userEmail, certificateId);
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateSummaryDTO getSummary(String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        List<Certificate> all = certificateRepository.findByUserOrderByIssueDateDesc(user);

        long total = all.size();
        long active = 0;
        long expiringSoon = 0;
        long expired = 0;
        long noExpiration = 0;

        Map<CertificateCategory, Long> categoryCounts = new HashMap<>();
        for (CertificateCategory cat : CertificateCategory.values()) {
            categoryCounts.put(cat, 0L);
        }

        for (Certificate cert : all) {
            ExpiryStatus status = CertificateMapper.calculateExpiryStatus(cert.getExpiryDate());
            switch (status) {
                case ACTIVE -> active++;
                case EXPIRING_SOON -> expiringSoon++;
                case EXPIRED -> expired++;
                case NO_EXPIRATION -> noExpiration++;
            }
            if (cert.getCategory() != null) {
                categoryCounts.put(cert.getCategory(), categoryCounts.getOrDefault(cert.getCategory(), 0L) + 1);
            }
        }

        return new CertificateSummaryDTO(total, active, expiringSoon, expired, noExpiration, categoryCounts);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("Certificate file is required and cannot be empty.");
        }

        if (file.getSize() > maxFileSizeBytes) {
            throw new InvalidRequestException(String.format("File size (%d bytes) exceeds maximum limit of %d bytes (%d MB).",
                    file.getSize(), maxFileSizeBytes, maxFileSizeBytes / (1024 * 1024)));
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new InvalidRequestException("Invalid file name. File must have an extension (e.g., .pdf, .png, .jpg).");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidRequestException("Unsupported file format: ." + extension + ". Allowed formats: PDF, PNG, JPG, JPEG, WEBP.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.isBlank()) {
            String lowerContentType = contentType.toLowerCase();
            if (!ALLOWED_MIME_TYPES.contains(lowerContentType) && !"image/pjpeg".equals(lowerContentType)) {
                throw new InvalidRequestException("Unsupported MIME type: " + contentType + ". Allowed types: PDF, PNG, JPEG, WEBP.");
            }
        }
    }

    private String normalizeMimeType(String contentType, String fileName) {
        if (contentType != null && !contentType.isBlank() && !"application/octet-stream".equalsIgnoreCase(contentType)) {
            return contentType.toLowerCase();
        }
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }
}
