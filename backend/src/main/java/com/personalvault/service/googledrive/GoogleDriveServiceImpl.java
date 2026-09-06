package com.personalvault.service.googledrive;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personalvault.dto.googledrive.GoogleDriveStatusResponse;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.googledrive.UserGoogleDriveIntegration;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.certificate.CertificateRepository;
import com.personalvault.repository.googledrive.UserGoogleDriveIntegrationRepository;
import com.personalvault.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {

    private final UserGoogleDriveIntegrationRepository driveIntegrationRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final JwtService jwtService;
    private final com.personalvault.service.vault.EncryptionService encryptionService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient;

    @Value("${spring.security.oauth2.client.registration.google.client-id:placeholder}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:placeholder}")
    private String clientSecret;

    @Value("${google.drive.redirect-uri:http://localhost:8080/api/integrations/google-drive/callback}")
    private String redirectUri;

    @Value("${google.drive.scope:https://www.googleapis.com/auth/drive.file}")
    private String driveScope;

    public GoogleDriveServiceImpl(UserGoogleDriveIntegrationRepository driveIntegrationRepository,
                                  UserRepository userRepository,
                                  CertificateRepository certificateRepository,
                                  JwtService jwtService,
                                  com.personalvault.service.vault.EncryptionService encryptionService) {
        this.driveIntegrationRepository = driveIntegrationRepository;
        this.userRepository = userRepository;
        this.certificateRepository = certificateRepository;
        this.jwtService = jwtService;
        this.encryptionService = encryptionService;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    @Override
    public String getAuthorizationUrl(User user) {
        if (user == null) {
            throw new UnauthorizedAccessException("Authentication required to connect Google Drive");
        }
        String state = jwtService.generateOAuthStateToken(user.getEmail());
        
        return "https://accounts.google.com/o/oauth2/v2/auth?" +
                "client_id=" + urlEncode(clientId) +
                "&redirect_uri=" + urlEncode(redirectUri) +
                "&response_type=code" +
                "&scope=" + urlEncode(driveScope) +
                "&access_type=offline" +
                "&prompt=consent" +
                "&state=" + urlEncode(state);
    }

    @Override
    @Transactional
    public void handleOAuthCallback(String code, String state) {
        if (code == null || code.isBlank()) {
            throw new InvalidRequestException("Authorization code is missing");
        }
        if (state == null || state.isBlank()) {
            throw new InvalidRequestException("State parameter is missing");
        }

        String userEmail = jwtService.extractEmailFromOAuthStateToken(state);
        if (userEmail == null) {
            throw new InvalidRequestException("Invalid or expired OAuth state token");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        try {
            // Exchange code for tokens
            Map<String, String> tokenParams = new HashMap<>();
            tokenParams.put("code", code);
            tokenParams.put("client_id", clientId);
            tokenParams.put("client_secret", clientSecret);
            tokenParams.put("redirect_uri", redirectUri);
            tokenParams.put("grant_type", "authorization_code");

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(buildFormData(tokenParams))
                    .build();

            HttpResponse<String> tokenResponse = httpClient.send(tokenRequest, HttpResponse.BodyHandlers.ofString());

            if (tokenResponse.statusCode() != 200) {
                throw new InvalidRequestException("Failed to exchange Google OAuth code: " + tokenResponse.body());
            }

            JsonNode tokenJson = objectMapper.readTree(tokenResponse.body());
            String accessToken = tokenJson.path("access_token").asText(null);
            String refreshToken = tokenJson.path("refresh_token").asText(null);
            int expiresIn = tokenJson.path("expires_in").asInt(3600);

            if (accessToken == null) {
                throw new InvalidRequestException("Google did not return an access token");
            }

            // Look for existing integration
            Optional<UserGoogleDriveIntegration> existingOpt = driveIntegrationRepository.findByUser(user);
            UserGoogleDriveIntegration integration = existingOpt.orElseGet(() -> {
                UserGoogleDriveIntegration newIntegration = new UserGoogleDriveIntegration();
                newIntegration.setUser(user);
                return newIntegration;
            });

            integration.setAccessToken(accessToken);
            if (refreshToken != null && !refreshToken.isBlank()) {
                integration.setRefreshToken(refreshToken);
            } else if (integration.getRefreshToken() == null) {
                throw new InvalidRequestException("Google did not provide a refresh token. Please revoke access in your Google Account security settings and reconnect.");
            }
            integration.setTokenExpiry(LocalDateTime.now().plusSeconds(expiresIn));

            // Fetch user Google Drive email via UserInfo or About API
            String driveEmail = fetchGoogleUserEmail(accessToken);
            if (driveEmail != null) {
                integration.setDriveEmail(driveEmail);
            } else {
                integration.setDriveEmail(user.getEmail());
            }

            driveIntegrationRepository.save(integration);

            // Ensure folder structure PersonalVault/Certificates exists
            ensureFolderStructure(user, integration);

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidRequestException("Error communicating with Google Drive: " + e.getMessage());
        }
    }

    @Override
    public GoogleDriveStatusResponse getStatus(User user) {
        if (user == null) {
            return GoogleDriveStatusResponse.disconnected();
        }
        Optional<UserGoogleDriveIntegration> integrationOpt = driveIntegrationRepository.findByUser(user);
        if (integrationOpt.isEmpty() || integrationOpt.get().getRefreshToken() == null) {
            return GoogleDriveStatusResponse.disconnected();
        }
        UserGoogleDriveIntegration integration = integrationOpt.get();
        long count = certificateRepository.countByUser(user);
        return GoogleDriveStatusResponse.connected(integration.getDriveEmail(), integration.getConnectedAt(), count);
    }

    @Override
    @Transactional
    public void disconnect(User user) {
        if (user == null) return;
        driveIntegrationRepository.findByUser(user).ifPresent(integration -> {
            // Attempt to revoke refresh token if possible
            if (integration.getRefreshToken() != null) {
                try {
                    HttpRequest revokeRequest = HttpRequest.newBuilder()
                            .uri(URI.create("https://oauth2.googleapis.com/revoke?token=" + urlEncode(integration.getRefreshToken())))
                            .header("Content-Type", "application/x-www-form-urlencoded")
                            .POST(HttpRequest.BodyPublishers.noBody())
                            .build();
                    httpClient.send(revokeRequest, HttpResponse.BodyHandlers.discarding());
                } catch (Exception ignored) {
                    // Revocation is best-effort
                }
            }
            driveIntegrationRepository.delete(integration);
        });
    }

    @Override
    public boolean isConnected(User user) {
        if (user == null) return false;
        return driveIntegrationRepository.findByUser(user)
                .map(i -> i.getRefreshToken() != null && !i.getRefreshToken().isBlank())
                .orElse(false);
    }

    @Override
    @Transactional
    public String uploadCertificateFile(User user, MultipartFile file, String customFileName) throws IOException {
        UserGoogleDriveIntegration integration = driveIntegrationRepository.findByUser(user)
                .orElseThrow(() -> new InvalidRequestException("Google Drive is not connected. Please connect Google Drive first."));

        String accessToken = getValidAccessToken(user, integration);
        String folderId = ensureFolderStructure(user, integration);

        String mimeType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        String fileName = (customFileName != null && !customFileName.isBlank()) ? customFileName : file.getOriginalFilename();

        String boundary = "===PersonalVaultBoundary" + System.currentTimeMillis() + "===";

        // Build multipart payload
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Part 1: Metadata JSON
        String metadataJson = String.format("{\"name\":\"%s\",\"parents\":[\"%s\"]}", escapeJson(fileName), folderId);
        baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write("Content-Type: application/json; charset=UTF-8\r\n\r\n".getBytes(StandardCharsets.UTF_8));
        baos.write(metadataJson.getBytes(StandardCharsets.UTF_8));
        baos.write("\r\n".getBytes(StandardCharsets.UTF_8));

        // Part 2: Media
        baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write(("Content-Type: " + mimeType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write(file.getBytes());
        baos.write("\r\n".getBytes(StandardCharsets.UTF_8));

        // End boundary
        baos.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));

        byte[] requestBody = baos.toByteArray();

        try {
            HttpRequest uploadRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "multipart/related; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(uploadRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new InvalidRequestException("Google Drive file upload failed with status " + response.statusCode() + ": " + response.body());
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String fileId = responseJson.path("id").asText(null);

            if (fileId == null || fileId.isBlank()) {
                throw new InvalidRequestException("Google Drive upload did not return a valid file ID");
            }

            return fileId;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidRequestException("Upload interrupted: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String uploadEncryptedVaultFile(User user, byte[] encryptedData, String customFileName, String mimeType, String subfolderName) throws IOException {
        UserGoogleDriveIntegration integration = driveIntegrationRepository.findByUser(user)
                .orElseThrow(() -> new InvalidRequestException("Google Drive is not connected. Please connect Google Drive first."));

        String accessToken = getValidAccessToken(user, integration);
        String folderId = ensureVaultSubfolderStructure(accessToken, integration, subfolderName);

        String uploadMimeType = (mimeType != null && !mimeType.isBlank()) ? mimeType : "application/octet-stream";
        String fileName = (customFileName != null && !customFileName.isBlank()) ? customFileName : "encrypted_document.bin";

        String boundary = "===PersonalVaultBoundary" + System.currentTimeMillis() + "===";

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Part 1: Metadata JSON
        String metadataJson = String.format("{\"name\":\"%s\",\"parents\":[\"%s\"]}", escapeJson(fileName), folderId);
        baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write("Content-Type: application/json; charset=UTF-8\r\n\r\n".getBytes(StandardCharsets.UTF_8));
        baos.write(metadataJson.getBytes(StandardCharsets.UTF_8));
        baos.write("\r\n".getBytes(StandardCharsets.UTF_8));

        // Part 2: Media
        baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write(("Content-Type: " + uploadMimeType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        baos.write(encryptedData);
        baos.write("\r\n".getBytes(StandardCharsets.UTF_8));

        // End boundary
        baos.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));

        byte[] requestBody = baos.toByteArray();

        try {
            HttpRequest uploadRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "multipart/related; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(uploadRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new InvalidRequestException("Google Drive vault file upload failed with status " + response.statusCode() + ": " + response.body());
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String fileId = responseJson.path("id").asText(null);

            if (fileId == null || fileId.isBlank()) {
                throw new InvalidRequestException("Google Drive vault upload did not return a valid file ID");
            }

            return fileId;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidRequestException("Vault upload interrupted: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadFileBytes(User user, String googleDriveFileId) {
        if (googleDriveFileId == null || googleDriveFileId.isBlank()) {
            throw new ResourceNotFoundException("Google Drive file ID is required");
        }
        UserGoogleDriveIntegration integration = driveIntegrationRepository.findByUser(user)
                .orElseThrow(() -> new InvalidRequestException("Google Drive is not connected for this user."));

        String accessToken = getValidAccessToken(user, integration);

        try {
            HttpRequest downloadRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/drive/v3/files/" + urlEncode(googleDriveFileId) + "?alt=media"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(downloadRequest, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 404) {
                throw new ResourceNotFoundException("Certificate file not found in Google Drive.");
            }
            if (response.statusCode() != 200) {
                throw new InvalidRequestException("Failed to download file from Google Drive (HTTP " + response.statusCode() + ")");
            }

            return response.body();

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidRequestException("Failed to stream certificate from Google Drive: " + e.getMessage());
        }
    }

    @Override
    public byte[] downloadEncryptedVaultFileBytes(User user, String googleDriveFileId) {
        byte[] rawBytes = downloadFileBytes(user, googleDriveFileId);
        return encryptionService.decryptBytes(rawBytes);
    }

    @Override
    public Resource downloadFileResource(User user, String googleDriveFileId) {
        byte[] data = downloadFileBytes(user, googleDriveFileId);
        return new ByteArrayResource(data);
    }

    @Override
    public void deleteFile(User user, String googleDriveFileId) {
        if (googleDriveFileId == null || googleDriveFileId.isBlank()) return;

        Optional<UserGoogleDriveIntegration> integrationOpt = driveIntegrationRepository.findByUser(user);
        if (integrationOpt.isEmpty()) return;

        try {
            String accessToken = getValidAccessToken(user, integrationOpt.get());
            HttpRequest deleteRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/drive/v3/files/" + urlEncode(googleDriveFileId)))
                    .header("Authorization", "Bearer " + accessToken)
                    .DELETE()
                    .build();

            HttpResponse<Void> response = httpClient.send(deleteRequest, HttpResponse.BodyHandlers.discarding());
            // 204 or 404 (already deleted) are both acceptable
            if (response.statusCode() != 204 && response.statusCode() != 200 && response.statusCode() != 404) {
                System.err.println("Google Drive delete warning: HTTP status " + response.statusCode());
            }
        } catch (Exception e) {
            // Log warning, do not block database delete
            System.err.println("Google Drive delete error: " + e.getMessage());
        }
    }

    private synchronized String getValidAccessToken(User user, UserGoogleDriveIntegration integration) {
        LocalDateTime expiry = integration.getTokenExpiry();
        if (integration.getAccessToken() != null && expiry != null && expiry.isAfter(LocalDateTime.now().plusSeconds(60))) {
            return integration.getAccessToken();
        }

        if (integration.getRefreshToken() == null || integration.getRefreshToken().isBlank()) {
            throw new InvalidRequestException("Google Drive refresh token is missing. Please reconnect Google Drive.");
        }

        try {
            Map<String, String> refreshParams = new HashMap<>();
            refreshParams.put("client_id", clientId);
            refreshParams.put("client_secret", clientSecret);
            refreshParams.put("refresh_token", integration.getRefreshToken());
            refreshParams.put("grant_type", "refresh_token");

            HttpRequest refreshRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(buildFormData(refreshParams))
                    .build();

            HttpResponse<String> response = httpClient.send(refreshRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new InvalidRequestException("Failed to refresh Google Drive access token. Please reconnect Google Drive. Error: " + response.body());
            }

            JsonNode responseJson = objectMapper.readTree(response.body());
            String newAccessToken = responseJson.path("access_token").asText();
            int expiresIn = responseJson.path("expires_in").asInt(3600);

            integration.setAccessToken(newAccessToken);
            integration.setTokenExpiry(LocalDateTime.now().plusSeconds(expiresIn));
            driveIntegrationRepository.save(integration);

            return newAccessToken;

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new InvalidRequestException("Error refreshing Google Drive token: " + e.getMessage());
        }
    }

    @Transactional
    public String ensureFolderStructure(User user, UserGoogleDriveIntegration integration) {
        String accessToken = getValidAccessToken(user, integration);

        String certFolderId = integration.getCertificatesFolderId();
        if (certFolderId != null && !certFolderId.isBlank()) {
            if (isFolderValid(accessToken, certFolderId)) {
                return certFolderId;
            }
        }

        try {
            // 1. Locate or create PersonalVault root folder
            String pvFolderId = findFolder(accessToken, "PersonalVault", "root");
            if (pvFolderId == null) {
                pvFolderId = createFolder(accessToken, "PersonalVault", "root");
            }
            integration.setPersonalVaultFolderId(pvFolderId);

            // 2. Locate or create Certificates subfolder
            certFolderId = findFolder(accessToken, "Certificates", pvFolderId);
            if (certFolderId == null) {
                certFolderId = createFolder(accessToken, "Certificates", pvFolderId);
            }
            integration.setCertificatesFolderId(certFolderId);

            driveIntegrationRepository.save(integration);
            return certFolderId;

        } catch (Exception e) {
            throw new InvalidRequestException("Failed to initialize Google Drive folder structure: " + e.getMessage());
        }
    }

    @Transactional
    public String ensureVaultSubfolderStructure(String accessToken, UserGoogleDriveIntegration integration, String subfolderName) {
        try {
            // 1. Locate or create PersonalVault root folder
            String pvFolderId = integration.getPersonalVaultFolderId();
            if (pvFolderId == null || !isFolderValid(accessToken, pvFolderId)) {
                pvFolderId = findFolder(accessToken, "PersonalVault", "root");
                if (pvFolderId == null) {
                    pvFolderId = createFolder(accessToken, "PersonalVault", "root");
                }
                integration.setPersonalVaultFolderId(pvFolderId);
                driveIntegrationRepository.save(integration);
            }

            // 2. Locate or create SecureVault subfolder
            String secureVaultFolderId = findFolder(accessToken, "SecureVault", pvFolderId);
            if (secureVaultFolderId == null) {
                secureVaultFolderId = createFolder(accessToken, "SecureVault", pvFolderId);
            }

            // 3. Locate or create requested category subfolder under SecureVault
            String safeSubfolderName = (subfolderName != null && !subfolderName.isBlank()) ? subfolderName.trim() : "Other Documents";
            String targetFolderId = findFolder(accessToken, safeSubfolderName, secureVaultFolderId);
            if (targetFolderId == null) {
                targetFolderId = createFolder(accessToken, safeSubfolderName, secureVaultFolderId);
            }

            return targetFolderId;
        } catch (Exception e) {
            throw new InvalidRequestException("Failed to initialize Secure Vault folder structure in Google Drive: " + e.getMessage());
        }
    }

    private boolean isFolderValid(String accessToken, String folderId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/drive/v3/files/" + urlEncode(folderId) + "?fields=id,trashed,mimeType"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode json = objectMapper.readTree(response.body());
                return !json.path("trashed").asBoolean(false) &&
                        "application/vnd.google-apps.folder".equals(json.path("mimeType").asText());
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private String findFolder(String accessToken, String folderName, String parentId) throws IOException, InterruptedException {
        String query = String.format("name = '%s' and '%s' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
                folderName.replace("'", "\\'"), parentId.replace("'", "\\'"));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://www.googleapis.com/drive/v3/files?q=" + urlEncode(query) + "&fields=files(id,name)"))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JsonNode json = objectMapper.readTree(response.body());
            JsonNode files = json.path("files");
            if (files.isArray() && files.size() > 0) {
                return files.get(0).path("id").asText();
            }
        }
        return null;
    }

    private String createFolder(String accessToken, String folderName, String parentId) throws IOException, InterruptedException {
        String jsonPayload = String.format("{\"name\":\"%s\",\"mimeType\":\"application/vnd.google-apps.folder\",\"parents\":[\"%s\"]}",
                escapeJson(folderName), parentId);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://www.googleapis.com/drive/v3/files?fields=id"))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new InvalidRequestException("Failed to create folder '" + folderName + "' in Google Drive: " + response.body());
        }

        JsonNode json = objectMapper.readTree(response.body());
        return json.path("id").asText();
    }

    private String fetchGoogleUserEmail(String accessToken) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v2/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode json = objectMapper.readTree(response.body());
                return json.path("email").asText(null);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private static HttpRequest.BodyPublisher buildFormData(Map<String, String> data) {
        StringBuilder builder = new StringBuilder();
        for (Map.Entry<String, String> entry : data.entrySet()) {
            if (!builder.isEmpty()) {
                builder.append("&");
            }
            builder.append(urlEncode(entry.getKey())).append("=").append(urlEncode(entry.getValue()));
        }
        return HttpRequest.BodyPublishers.ofString(builder.toString());
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
