package com.personalvault.service.googledrive;

import com.personalvault.dto.googledrive.GoogleDriveStatusResponse;
import com.personalvault.entity.auth.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface GoogleDriveService {

    String getAuthorizationUrl(User user);

    void handleOAuthCallback(String code, String state);

    GoogleDriveStatusResponse getStatus(User user);

    void disconnect(User user);

    boolean isConnected(User user);

    String uploadCertificateFile(User user, MultipartFile file, String customFileName) throws IOException;

    String uploadEncryptedVaultFile(User user, byte[] encryptedData, String customFileName, String mimeType, String subfolderName) throws IOException;

    byte[] downloadFileBytes(User user, String googleDriveFileId);

    byte[] downloadEncryptedVaultFileBytes(User user, String googleDriveFileId);

    Resource downloadFileResource(User user, String googleDriveFileId);

    void deleteFile(User user, String googleDriveFileId);
}
