package com.personalvault.service.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.IdentityDocumentType;
import com.personalvault.entity.vault.VaultIdentityDocument;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.vault.MaskingUtil;
import com.personalvault.mapper.vault.VaultIdentityDocumentMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.vault.VaultIdentityDocumentRepository;
import com.personalvault.service.googledrive.GoogleDriveService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VaultIdentityDocumentService {

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

    private final VaultIdentityDocumentRepository identityRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final VaultSecurityService vaultSecurityService;
    private final GoogleDriveService googleDriveService;

    public VaultIdentityDocumentService(VaultIdentityDocumentRepository identityRepository,
                                        UserRepository userRepository,
                                        EncryptionService encryptionService,
                                        VaultSecurityService vaultSecurityService,
                                        GoogleDriveService googleDriveService) {
        this.identityRepository = identityRepository;
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.vaultSecurityService = vaultSecurityService;
        this.googleDriveService = googleDriveService;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return;
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidRequestException("File size exceeds the 20MB limit.");
        }
        String mime = file.getContentType();
        if (mime != null && !ALLOWED_MIME_TYPES.contains(mime.toLowerCase())) {
            throw new InvalidRequestException("Unsupported file type: " + mime + ". Allowed types: PDF, PNG, JPG, JPEG, WEBP.");
        }
    }

    private String maskNumber(IdentityDocumentType type, String rawNumber) {
        if (type == null || rawNumber == null) return "";
        return switch (type) {
            case AADHAAR -> MaskingUtil.maskAadhaar(rawNumber);
            case PAN -> MaskingUtil.maskPan(rawNumber);
            default -> MaskingUtil.maskGenericId(rawNumber);
        };
    }

    @Transactional
    public IdentityDocumentResponse createIdentityDocument(String userEmail, CreateIdentityDocumentRequest request) {
        User user = getAuthenticatedUser(userEmail);

        validateFile(request.getFrontFile());
        validateFile(request.getBackFile());

        if ((request.getFrontFile() != null && !request.getFrontFile().isEmpty()) ||
            (request.getBackFile() != null && !request.getBackFile().isEmpty())) {
            if (!googleDriveService.isConnected(user)) {
                throw new InvalidRequestException("Google Drive is not connected. Please connect Google Drive before uploading documents.");
            }
        }

        VaultIdentityDocument doc = new VaultIdentityDocument();
        doc.setUser(user);
        doc.setType(request.getType());
        doc.setHolderName(request.getHolderName().trim());
        doc.setMaskedNumber(maskNumber(request.getType(), request.getDocumentNumber()));
        doc.setEncryptedDocumentNumber(encryptionService.encrypt(request.getDocumentNumber().trim()));
        doc.setIssueDate(request.getIssueDate());
        doc.setExpiryDate(request.getExpiryDate());
        doc.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        // Upload front file if provided
        if (request.getFrontFile() != null && !request.getFrontFile().isEmpty()) {
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getFrontFile().getBytes());
                String frontId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getFrontFile().getOriginalFilename(),
                        request.getFrontFile().getContentType(), "Identity Documents");
                doc.setDriveFileIdFront(frontId);
                doc.setFileNameFront(request.getFrontFile().getOriginalFilename());
                doc.setMimeTypeFront(request.getFrontFile().getContentType());
                doc.setFileSizeFront(request.getFrontFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload front document: " + e.getMessage());
            }
        }

        // Upload back file if provided
        if (request.getBackFile() != null && !request.getBackFile().isEmpty()) {
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getBackFile().getBytes());
                String backId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getBackFile().getOriginalFilename(),
                        request.getBackFile().getContentType(), "Identity Documents");
                doc.setDriveFileIdBack(backId);
                doc.setFileNameBack(request.getBackFile().getOriginalFilename());
                doc.setMimeTypeBack(request.getBackFile().getContentType());
                doc.setFileSizeBack(request.getBackFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload back document: " + e.getMessage());
            }
        }

        VaultIdentityDocument saved = identityRepository.save(doc);
        return VaultIdentityDocumentMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IdentityDocumentResponse> getIdentityDocuments(String userEmail, IdentityDocumentType type, String search) {
        User user = getAuthenticatedUser(userEmail);

        List<VaultIdentityDocument> list;
        if (search != null && !search.isBlank()) {
            list = identityRepository.searchIdentityDocuments(user, search.trim());
            if (type != null) {
                list = list.stream().filter(d -> d.getType() == type).collect(Collectors.toList());
            }
        } else if (type != null) {
            list = identityRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type);
        } else {
            list = identityRepository.findByUserOrderByCreatedAtDesc(user);
        }

        return list.stream()
                .map(VaultIdentityDocumentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IdentityDocumentResponse getIdentityDocumentById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultIdentityDocument doc = identityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identity document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to view this document.");
        }

        return VaultIdentityDocumentMapper.toResponse(doc);
    }

    @Transactional
    public IdentityDocumentResponse updateIdentityDocument(String userEmail, Long id, UpdateIdentityDocumentRequest request) {
        User user = getAuthenticatedUser(userEmail);
        VaultIdentityDocument doc = identityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identity document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this document.");
        }

        validateFile(request.getFrontFile());
        validateFile(request.getBackFile());

        doc.setType(request.getType());
        doc.setHolderName(request.getHolderName().trim());
        if (request.getDocumentNumber() != null && !request.getDocumentNumber().isBlank()) {
            doc.setMaskedNumber(maskNumber(request.getType(), request.getDocumentNumber()));
            doc.setEncryptedDocumentNumber(encryptionService.encrypt(request.getDocumentNumber().trim()));
        }
        doc.setIssueDate(request.getIssueDate());
        doc.setExpiryDate(request.getExpiryDate());
        doc.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        // Replace front file if provided
        if (request.getFrontFile() != null && !request.getFrontFile().isEmpty()) {
            if (doc.getDriveFileIdFront() != null) {
                googleDriveService.deleteFile(user, doc.getDriveFileIdFront());
            }
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getFrontFile().getBytes());
                String frontId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getFrontFile().getOriginalFilename(),
                        request.getFrontFile().getContentType(), "Identity Documents");
                doc.setDriveFileIdFront(frontId);
                doc.setFileNameFront(request.getFrontFile().getOriginalFilename());
                doc.setMimeTypeFront(request.getFrontFile().getContentType());
                doc.setFileSizeFront(request.getFrontFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload updated front document: " + e.getMessage());
            }
        }

        // Replace back file if provided
        if (request.getBackFile() != null && !request.getBackFile().isEmpty()) {
            if (doc.getDriveFileIdBack() != null) {
                googleDriveService.deleteFile(user, doc.getDriveFileIdBack());
            }
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getBackFile().getBytes());
                String backId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getBackFile().getOriginalFilename(),
                        request.getBackFile().getContentType(), "Identity Documents");
                doc.setDriveFileIdBack(backId);
                doc.setFileNameBack(request.getBackFile().getOriginalFilename());
                doc.setMimeTypeBack(request.getBackFile().getContentType());
                doc.setFileSizeBack(request.getBackFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload updated back document: " + e.getMessage());
            }
        }

        VaultIdentityDocument updated = identityRepository.save(doc);
        return VaultIdentityDocumentMapper.toResponse(updated);
    }

    @Transactional
    public void deleteIdentityDocument(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultIdentityDocument doc = identityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identity document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this document.");
        }

        String frontId = doc.getDriveFileIdFront();
        String backId = doc.getDriveFileIdBack();

        identityRepository.delete(doc);

        if (frontId != null) {
            googleDriveService.deleteFile(user, frontId);
        }
        if (backId != null) {
            googleDriveService.deleteFile(user, backId);
        }
    }

    @Transactional(readOnly = true)
    public IdentityDocumentRevealResponse revealIdentityDocument(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultIdentityDocument doc = identityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identity document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to reveal this document.");
        }

        String plainNumber = encryptionService.decrypt(doc.getEncryptedDocumentNumber());
        String plainNotes = encryptionService.decrypt(doc.getEncryptedNotes());

        return VaultIdentityDocumentMapper.toRevealResponse(doc, plainNumber, plainNotes);
    }

    @Transactional(readOnly = true)
    public Resource getIdentityDocumentFileResource(String userEmail, Long id, String side, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultIdentityDocument doc = identityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identity document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this document.");
        }

        boolean isBack = "back".equalsIgnoreCase(side);
        String driveFileId = isBack ? doc.getDriveFileIdBack() : doc.getDriveFileIdFront();

        if (driveFileId == null || driveFileId.isBlank()) {
            throw new ResourceNotFoundException("Requested document side (" + side + ") does not exist for this record.");
        }

        byte[] decryptedBytes = googleDriveService.downloadEncryptedVaultFileBytes(user, driveFileId);
        return new ByteArrayResource(decryptedBytes);
    }
}
