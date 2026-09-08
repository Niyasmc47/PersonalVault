package com.personalvault.service.vault;

import com.personalvault.dto.vault.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.vault.FinancialAccountType;
import com.personalvault.entity.vault.VaultFinancialAccount;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.vault.MaskingUtil;
import com.personalvault.mapper.vault.VaultFinancialAccountMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.vault.VaultFinancialAccountRepository;
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
public class VaultFinancialAccountService {

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

    private final VaultFinancialAccountRepository financialRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final VaultSecurityService vaultSecurityService;
    private final GoogleDriveService googleDriveService;

    public VaultFinancialAccountService(VaultFinancialAccountRepository financialRepository,
                                        UserRepository userRepository,
                                        EncryptionService encryptionService,
                                        VaultSecurityService vaultSecurityService,
                                        GoogleDriveService googleDriveService) {
        this.financialRepository = financialRepository;
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
            throw new InvalidRequestException("File size exceeds 20MB limit.");
        }
        String mime = file.getContentType();
        if (mime != null && !ALLOWED_MIME_TYPES.contains(mime.toLowerCase())) {
            throw new InvalidRequestException("Unsupported file type: " + mime + ". Allowed types: PDF, PNG, JPG, JPEG, WEBP.");
        }
    }

    @Transactional
    public FinancialAccountResponse createAccount(String userEmail, CreateFinancialAccountRequest request) {
        User user = getAuthenticatedUser(userEmail);

        validateFile(request.getFile());

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            if (!googleDriveService.isConnected(user)) {
                throw new InvalidRequestException("Google Drive is not connected. Please connect Google Drive to upload financial documents.");
            }
        }

        VaultFinancialAccount account = new VaultFinancialAccount();
        account.setUser(user);
        account.setBankName(request.getBankName().trim());
        account.setMaskedAccountNumber(MaskingUtil.maskAccountNumber(request.getAccountNumber()));
        account.setEncryptedAccountNumber(encryptionService.encrypt(request.getAccountNumber().trim()));
        account.setIfsc(request.getIfsc() != null ? request.getIfsc().trim().toUpperCase() : null);
        account.setBranch(request.getBranch() != null ? request.getBranch().trim() : null);
        account.setAccountType(request.getAccountType());
        account.setUpiId(request.getUpiId() != null ? request.getUpiId().trim() : null);
        account.setEncryptedTaxInfo(request.getTaxInfo() != null && !request.getTaxInfo().isBlank()
                ? encryptionService.encrypt(request.getTaxInfo().trim()) : null);
        account.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getFile().getBytes());
                String fileId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getFile().getOriginalFilename(),
                        request.getFile().getContentType(), "Financial Documents");
                account.setDriveFileId(fileId);
                account.setFileName(request.getFile().getOriginalFilename());
                account.setMimeType(request.getFile().getContentType());
                account.setFileSize(request.getFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload financial document: " + e.getMessage());
            }
        }

        VaultFinancialAccount saved = financialRepository.save(account);
        return VaultFinancialAccountMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FinancialAccountResponse> getAccounts(String userEmail, FinancialAccountType accountType, String search) {
        User user = getAuthenticatedUser(userEmail);

        List<VaultFinancialAccount> list;
        if (search != null && !search.isBlank()) {
            list = financialRepository.searchAccounts(user, search.trim());
            if (accountType != null) {
                list = list.stream().filter(a -> a.getAccountType() == accountType).collect(Collectors.toList());
            }
        } else if (accountType != null) {
            list = financialRepository.findByUserAndAccountTypeOrderByCreatedAtDesc(user, accountType);
        } else {
            list = financialRepository.findByUserOrderByCreatedAtDesc(user);
        }

        return list.stream()
                .map(VaultFinancialAccountMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FinancialAccountResponse getAccountById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultFinancialAccount account = financialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found with ID: " + id));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to view this account.");
        }

        return VaultFinancialAccountMapper.toResponse(account);
    }

    @Transactional
    public FinancialAccountResponse updateAccount(String userEmail, Long id, UpdateFinancialAccountRequest request) {
        User user = getAuthenticatedUser(userEmail);
        VaultFinancialAccount account = financialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found with ID: " + id));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this account.");
        }

        validateFile(request.getFile());

        account.setBankName(request.getBankName().trim());
        if (request.getAccountNumber() != null && !request.getAccountNumber().isBlank()) {
            account.setMaskedAccountNumber(MaskingUtil.maskAccountNumber(request.getAccountNumber()));
            account.setEncryptedAccountNumber(encryptionService.encrypt(request.getAccountNumber().trim()));
        }
        account.setIfsc(request.getIfsc() != null ? request.getIfsc().trim().toUpperCase() : null);
        account.setBranch(request.getBranch() != null ? request.getBranch().trim() : null);
        account.setAccountType(request.getAccountType());
        account.setUpiId(request.getUpiId() != null ? request.getUpiId().trim() : null);
        account.setEncryptedTaxInfo(request.getTaxInfo() != null && !request.getTaxInfo().isBlank()
                ? encryptionService.encrypt(request.getTaxInfo().trim()) : null);
        account.setEncryptedNotes(request.getNotes() != null && !request.getNotes().isBlank()
                ? encryptionService.encrypt(request.getNotes().trim()) : null);

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            if (account.getDriveFileId() != null) {
                googleDriveService.deleteFile(user, account.getDriveFileId());
            }
            try {
                byte[] encBytes = encryptionService.encryptBytes(request.getFile().getBytes());
                String fileId = googleDriveService.uploadEncryptedVaultFile(
                        user, encBytes, request.getFile().getOriginalFilename(),
                        request.getFile().getContentType(), "Financial Documents");
                account.setDriveFileId(fileId);
                account.setFileName(request.getFile().getOriginalFilename());
                account.setMimeType(request.getFile().getContentType());
                account.setFileSize(request.getFile().getSize());
            } catch (IOException e) {
                throw new InvalidRequestException("Failed to upload updated financial document: " + e.getMessage());
            }
        }

        VaultFinancialAccount updated = financialRepository.save(account);
        return VaultFinancialAccountMapper.toResponse(updated);
    }

    @Transactional
    public void deleteAccount(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        VaultFinancialAccount account = financialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found with ID: " + id));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this account.");
        }

        String fileId = account.getDriveFileId();
        financialRepository.delete(account);

        if (fileId != null) {
            googleDriveService.deleteFile(user, fileId);
        }
    }

    @Transactional(readOnly = true)
    public FinancialAccountRevealResponse revealAccount(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultFinancialAccount account = financialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found with ID: " + id));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to reveal this account.");
        }

        String plainAccount = encryptionService.decrypt(account.getEncryptedAccountNumber());
        String plainTaxInfo = encryptionService.decrypt(account.getEncryptedTaxInfo());
        String plainNotes = encryptionService.decrypt(account.getEncryptedNotes());

        return VaultFinancialAccountMapper.toRevealResponse(account, plainAccount, plainTaxInfo, plainNotes);
    }

    @Transactional(readOnly = true)
    public Resource getAccountFileResource(String userEmail, Long id, String vaultToken) {
        vaultSecurityService.requireUnlocked(vaultToken, userEmail);

        User user = getAuthenticatedUser(userEmail);
        VaultFinancialAccount account = financialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found with ID: " + id));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this document.");
        }

        if (account.getDriveFileId() == null || account.getDriveFileId().isBlank()) {
            throw new ResourceNotFoundException("No document attached to this financial record.");
        }

        byte[] decryptedBytes = googleDriveService.downloadEncryptedVaultFileBytes(user, account.getDriveFileId());
        return new ByteArrayResource(decryptedBytes);
    }
}
