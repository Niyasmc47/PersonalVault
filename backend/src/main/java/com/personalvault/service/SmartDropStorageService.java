package com.personalvault.service;

import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.model.TempUploadedFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SmartDropStorageService {

    private static final Logger log = LoggerFactory.getLogger(SmartDropStorageService.class);
    private static final Duration FILE_EXPIRATION = Duration.ofMinutes(30);

    private final Path tempStorageDir;
    private final Map<String, TempUploadedFile> activeTempFiles = new ConcurrentHashMap<>();

    public SmartDropStorageService() {
        this.tempStorageDir = Paths.get(System.getProperty("java.io.tmpdir"), "personalvault-smartdrop");
        try {
            Files.createDirectories(tempStorageDir);
        } catch (IOException e) {
            log.error("Failed to create SmartDrop temp directory", e);
        }
    }

    public TempUploadedFile storeTempFile(String userEmail, MultipartFile multipartFile) throws IOException {
        String tempId = UUID.randomUUID().toString();
        String originalFilename = multipartFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "file_" + tempId;
        }

        // Clean filename to prevent path traversal
        String safeFilename = tempId + "_" + Paths.get(originalFilename).getFileName().toString();
        Path targetPath = tempStorageDir.resolve(safeFilename);
        multipartFile.transferTo(targetPath.toFile());

        Instant now = Instant.now();
        Instant expiresAt = now.plus(FILE_EXPIRATION);

        TempUploadedFile tempUploadedFile = new TempUploadedFile(
                tempId,
                userEmail,
                originalFilename,
                multipartFile.getContentType(),
                multipartFile.getSize(),
                targetPath.toFile(),
                now,
                expiresAt
        );

        activeTempFiles.put(tempId, tempUploadedFile);
        return tempUploadedFile;
    }

    public TempUploadedFile getTempFile(String tempId, String userEmail) {
        TempUploadedFile temp = activeTempFiles.get(tempId);
        if (temp == null || !temp.getTempFile().exists()) {
            throw new ResourceNotFoundException("Temporary file not found or has expired: " + tempId);
        }
        if (!temp.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new UnauthorizedAccessException("You do not have permission to access this temporary file.");
        }
        return temp;
    }

    public void removeTempFile(String tempId, String userEmail) {
        TempUploadedFile temp = activeTempFiles.get(tempId);
        if (temp != null) {
            if (!temp.getUserEmail().equalsIgnoreCase(userEmail)) {
                throw new UnauthorizedAccessException("You do not have permission to delete this temporary file.");
            }
            activeTempFiles.remove(tempId);
            try {
                if (temp.getTempFile() != null && temp.getTempFile().exists()) {
                    Files.deleteIfExists(temp.getTempFile().toPath());
                }
            } catch (IOException e) {
                log.warn("Failed to delete temp file {}: {}", temp.getTempFile().getAbsolutePath(), e.getMessage());
            }
        }
    }

    @Scheduled(fixedRate = 600000) // Cleanup every 10 minutes
    public void cleanupExpiredFiles() {
        Instant now = Instant.now();
        activeTempFiles.entrySet().removeIf(entry -> {
            TempUploadedFile file = entry.getValue();
            if (file.getExpiresAt().isBefore(now)) {
                try {
                    if (file.getTempFile() != null && file.getTempFile().exists()) {
                        Files.deleteIfExists(file.getTempFile().toPath());
                    }
                } catch (IOException e) {
                    log.warn("Failed to delete expired temp file: {}", e.getMessage());
                }
                return true;
            }
            return false;
        });
    }
}
