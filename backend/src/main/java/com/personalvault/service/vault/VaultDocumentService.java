package com.personalvault.service.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.VaultDocument;
import com.personalvault.entity.vault.VaultDocumentCategory;
import com.personalvault.entity.vault.VaultDocumentSection;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.vault.VaultDocumentMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.vault.VaultDocumentRepository;
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
public class VaultDocumentService {

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

    private final VaultDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final VaultSecurityService vaultSecurityService;
    private final GoogleDriveService googleDriveService;

    public VaultDocumentService(VaultDocumentRepository documentRepository,
                                UserRepository userRepository,
                                EncryptionService encryptionService,
                                VaultSecurityService vaultSecurityService,
                                GoogleDriveService googleDriveService) {
        this.documentRepository = documentRepository;
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
        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("Document file is required.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidRequestException("File size exceeds 20MB limit.");
        }
        String mime = file.getContentType();
        if (mime != null && !ALLOWED_MIME_TYPES.contains(mime.toLowerCase())) {
            throw new InvalidRequestException("Unsupported file type: " + mime + ". Allowed types: PDF, PNG, JPG, JPEG, WEBP.");
        }
    }

    private String getSubfolderName(VaultDocumentSection section) {
        return section == VaultDocumentSection.EDUCATION ? "Educational Documents" : "Other Documents";
    }

    @Transactional
    public VaultDocumentResponse createDocument(String userEmail, CreateVaultDocumentRequest request) {
        User user = getAuthenticatedUser(userEmail);

        if (!googleDriveService.isConnected(user)) {
            throw new InvalidRequestException("Google Drive is not connected. Please connect Google Drive before uploading documents.");
        }

        MultipartFile file = request.getFile();
        validateFile(file);

        VaultDocument doc = new VaultDocument();
        doc.setUser(user);
        doc.setSection(request.getSection());
        doc.setCategory(request.getCategory());
        doc.setTitle(request.getTitle().trim());
        doc.setIssuerOrInstitution(request.getIssuerOrInstitution() != null ? request.getIssuerOrInstitution().trim() : null);
        doc.setDocumentIdentifier(request.getDocumentIdentifier() != null ? request.getDocumentIdentifier().trim() : null);
        doc.setIssueDate(request.getIssueDate());
        doc.setExpiryDate(request.getExpiryDate());
        doc.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        try {
            byte[] encBytes = encryptionService.encryptBytes(file.getBytes());
            String subfolder = getSubfolderName(request.getSection());
            String fileId = googleDriveService.uploadEncryptedVaultFile(
                    user, encBytes, file.getOriginalFilename(), file.getContentType(), subfolder);

            doc.setGoogleDriveFileId(fileId);
            doc.setOriginalFileName(file.getOriginalFilename());
            doc.setMimeType(file.getContentType());
            doc.setFileSize(file.getSize());

            VaultDocument saved = documentRepository.save(doc);
            return VaultDocumentMapper.toResponse(saved);
        } catch (IOException e) {
            throw new InvalidRequestException("Failed to upload document file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<VaultDocumentResponse> getDocuments(String userEmail, VaultDocumentSection section, VaultDocumentCategory category, String search) {
        User user = getAuthenticatedUser(userEmail);

        List<VaultDocument> list;
        if (search != null && !search.isBlank()) {
            list = documentRepository.searchDocuments(user, section, search.trim());
            if (category != null) {
                list = list.stream().filter(d -> d.getCategory() == category).collect(Collectors.toList());
            }
        } else if (category != null) {
            list = documentRepository.findByUserAndSectionAndCategoryOrderByCreatedAtDesc(user, section, category);
        } else {
            list = documentRepository.findByUserAndSectionOrderByCreatedAtDesc(user, section);
        }

        return list.stream()
                .map(VaultDocumentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VaultDocumentResponse getDocumentById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to view this document.");
        }

        return VaultDocumentMapper.toResponse(doc);
    }

    @Transactional
    public VaultDocumentResponse updateDocument(String userEmail, Long id, UpdateVaultDocumentRequest request) {
        User user = getAuthenticatedUser(userEmail);
        VaultDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this document.");
        }

        doc.setCategory(request.getCategory());
        doc.setTitle(request.getTitle().trim());
        doc.setIssuerOrInstitution(request.getIssuerOrInstitution() != null ? request.getIssuerOrInstitution().trim() : null);
        doc.setDocumentIdentifier(request.getDocumentIdentifier() != null ? request.getDocumentIdentifier().trim() : null);
        doc.setIssueDate(request.getIssueDate());
        doc.setExpiryDate(request.getExpiryDate());
        doc.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            validateFile(request.getFile());
            if (doc.getGoogleDriveFileId() != null) {
                googleDriveService.deleteFile(user, doc.getGoogleDriveFileId());
            }
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getFile().getBytes());
                String subfolder = getSubfolderName(doc.getSection());
                String fileId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getFile().getOriginalFilename(),
                        request.getFile().getContentType(), subfolder);

                doc.setGoogleDriveFileId(fileId);
                doc.setOriginalFileName(request.getFile().getOriginalFilename());
                doc.setMimeType(request.getFile().getContentType());
                doc.setFileSize(request.getFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload updated document file: " + e.getMessage());
            }
        }

        VaultDocument updated = documentRepository.save(doc);
        return VaultDocumentMapper.toResponse(updated);
    }

    @Transactional
    public void deleteDocument(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this document.");
        }

        String fileId = doc.getGoogleDriveFileId();
        documentRepository.delete(doc);

        if (fileId != null) {
            googleDriveService.deleteFile(user, fileId);
        }
    }

    @Transactional(readOnly = true)
    public VaultDocumentRevealResponse revealDocument(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to reveal this document.");
        }

        String plainNotes = encryptionService.decrypt(doc.getEncryptedNotes());
        return VaultDocumentMapper.toRevealResponse(doc, plainNotes);
    }

    @Transactional(readOnly = true)
    public Resource getDocumentFileResource(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this document.");
        }

        byte[] decryptedBytes = googleDriveService.downloadEncryptedVaultFileBytes(user, doc.getGoogleDriveFileId());
        return new ByteArrayResource(decryptedBytes);
    }
}
