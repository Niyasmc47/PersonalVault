package com.personalvault.extractor;

import com.personalvault.model.ExtractedContent;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.HexFormat;

@Component
public class DocxContentExtractor implements FileContentExtractor {

    private static final Logger log = LoggerFactory.getLogger(DocxContentExtractor.class);

    @Override
    public boolean supports(String contentType, String filename) {
        if (contentType != null && (
                contentType.equalsIgnoreCase("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equalsIgnoreCase("application/msword"))) {
            return true;
        }
        return filename != null && (filename.toLowerCase().endsWith(".docx") || filename.toLowerCase().endsWith(".doc"));
    }

    @Override
    public ExtractedContent extract(File file, String filename, String contentType) throws IOException {
        String hash = computeSha256(file);
        try (FileInputStream fis = new FileInputStream(file);
             XWPFDocument document = new XWPFDocument(fis);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            String fullText = extractor.getText();
            if (fullText == null) {
                fullText = "";
            }
            fullText = fullText.trim();
            String snippet = fullText.length() > 400 ? fullText.substring(0, 400) + "..." : fullText;

            int paragraphCount = document.getParagraphs().size();
            ExtractedContent content = new ExtractedContent(fullText, snippet, 1, false, hash);
            content.getTechnicalMetadata().put("paragraphCount", paragraphCount);
            return content;
        } catch (Exception e) {
            log.warn("Error extracting text from DOCX: {}", e.getMessage());
            return new ExtractedContent("", "", 1, false, hash);
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
