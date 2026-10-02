package com.personalvault.extractor;

import com.personalvault.model.ExtractedContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.HexFormat;

@Component
public class ImageContentExtractor implements FileContentExtractor {

    private static final Logger log = LoggerFactory.getLogger(ImageContentExtractor.class);

    @Override
    public boolean supports(String contentType, String filename) {
        if (contentType != null && contentType.toLowerCase().startsWith("image/")) {
            return true;
        }
        if (filename != null) {
            String lower = filename.toLowerCase();
            return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") ||
                   lower.endsWith(".webp") || lower.endsWith(".bmp") || lower.endsWith(".gif");
        }
        return false;
    }

    @Override
    public ExtractedContent extract(File file, String filename, String contentType) throws IOException {
        String hash = computeSha256(file);
        ExtractedContent content = new ExtractedContent("", "[Image File]", 1, true, hash);

        try {
            BufferedImage image = ImageIO.read(file);
            if (image != null) {
                int width = image.getWidth();
                int height = image.getHeight();
                content.getTechnicalMetadata().put("width", width);
                content.getTechnicalMetadata().put("height", height);
                content.getTechnicalMetadata().put("aspectRatio", (double) width / height);

                // Analyze aspect ratio and layout hints
                if (width > 0 && height > 0) {
                    double ratio = (double) width / height;
                    if (ratio > 1.4 && ratio < 1.7) {
                        content.getTechnicalMetadata().put("idCardLayoutCandidate", true); // Typical ID card ratio ~1.58
                    } else if (ratio > 1.2 && ratio < 1.45) {
                        content.getTechnicalMetadata().put("landscapeCertificateCandidate", true); // Typical landscape certificate
                    } else if (ratio > 0.65 && ratio < 0.8) {
                        content.getTechnicalMetadata().put("portraitDocumentCandidate", true); // A4 portrait ~0.707
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not parse image metadata for {}: {}", filename, e.getMessage());
        }

        return content;
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
