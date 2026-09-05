package com.personalvault.controller.googledrive;

import com.personalvault.dto.googledrive.GoogleDriveStatusResponse;
import com.personalvault.entity.auth.User;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.security.CustomUserDetails;
import com.personalvault.service.googledrive.GoogleDriveService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations/google-drive")
public class GoogleDriveController {

    private final GoogleDriveService googleDriveService;
    private final UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public GoogleDriveController(GoogleDriveService googleDriveService, UserRepository userRepository) {
        this.googleDriveService = googleDriveService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(CustomUserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }

    @GetMapping("/status")
    public ResponseEntity<GoogleDriveStatusResponse> getStatus(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        if (user == null) {
            return ResponseEntity.ok(GoogleDriveStatusResponse.disconnected());
        }
        GoogleDriveStatusResponse status = googleDriveService.getStatus(user);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/auth-url")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        String url = googleDriveService.getAuthorizationUrl(user);
        return ResponseEntity.ok(Map.of("authUrl", url));
    }

    @GetMapping("/callback")
    public void handleCallback(@RequestParam(value = "code", required = false) String code,
                               @RequestParam(value = "state", required = false) String state,
                               @RequestParam(value = "error", required = false) String error,
                               HttpServletResponse response) throws IOException {
        if (error != null) {
            String redirect = frontendUrl + "/certificates?drive_error=" + URLEncoder.encode(error, StandardCharsets.UTF_8);
            response.sendRedirect(redirect);
            return;
        }

        try {
            googleDriveService.handleOAuthCallback(code, state);
            response.sendRedirect(frontendUrl + "/certificates?drive_connected=true");
        } catch (Exception e) {
            String redirect = frontendUrl + "/certificates?drive_error=" + URLEncoder.encode(e.getMessage() != null ? e.getMessage() : "Authorization failed", StandardCharsets.UTF_8);
            response.sendRedirect(redirect);
        }
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Map<String, String>> disconnect(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        googleDriveService.disconnect(user);
        return ResponseEntity.ok(Map.of("message", "Google Drive disconnected successfully"));
    }
}
