package com.personalvault.extractor;

import com.personalvault.model.ExtractedContent;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.HexFormat;

@Component
public class TextContentExtractor implements FileContentExtractor {

    @Override
    public boolean supports(String contentType, String filename) {
        if (contentType != null && (
                contentType.startsWith("text/") ||
                contentType.equalsIgnoreCase("application/json") ||
                contentType.equalsIgnoreCase("text/markdown"))) {
            return true;
        }
        return filename != null && (
                filename.toLowerCase().endsWith(".txt") ||
                filename.toLowerCase().endsWith(".md") ||
                filename.toLowerCase().endsWith(".csv") ||
                filename.toLowerCase().endsWith(".json")
        );
    }

    @Override
    public ExtractedContent extract(File file, String filename, String contentType) throws IOException {
        String hash = computeSha256(file);
        try {
            String fullText = Files.readString(file.toPath(), StandardCharsets.UTF_8).trim();
            String snippet = fullText.length() > 400 ? fullText.substring(0, 400) + "..." : fullText;
            return new ExtractedContent(fullText, snippet, 1, false, hash);
        } catch (Exception e) {
            // Fallback with ISO-8859-1
            String fullText = Files.readString(file.toPath(), StandardCharsets.ISO_8859_1).trim();
            String snippet = fullText.length() > 400 ? fullText.substring(0, 400) + "..." : fullText;
            return new ExtractedContent(fullText, snippet, 1, false, hash);
        }
    }

    private String computeSha256(File file) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] fileBytes = Files.readAllBytes(file.toPath());
            byte[] hashBytes = digest.digest(fileBytes);
            return HexFormat.of().formatHex(hashBytes);
        } catch (Exception e) {
            return "";
        }
    }
}
