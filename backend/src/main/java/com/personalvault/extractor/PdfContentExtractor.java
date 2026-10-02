package com.personalvault.extractor;

import com.personalvault.model.ExtractedContent;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.HexFormat;

@Component
public class PdfContentExtractor implements FileContentExtractor {

    private static final Logger log = LoggerFactory.getLogger(PdfContentExtractor.class);

    @Override
    public boolean supports(String contentType, String filename) {
        if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
            return true;
        }
        return filename != null && filename.toLowerCase().endsWith(".pdf");
    }

    @Override
    public ExtractedContent extract(File file, String filename, String contentType) throws IOException {
        String hash = computeSha256(file);
        try (PDDocument document = Loader.loadPDF(file)) {
            int pageCount = document.getNumberOfPages();
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String fullText = stripper.getText(document);

            if (fullText == null) {
                fullText = "";
            }

            fullText = fullText.trim();
            String snippet = fullText.length() > 400 ? fullText.substring(0, 400) + "..." : fullText;

            ExtractedContent content = new ExtractedContent(fullText, snippet, pageCount, pageCount > 0, hash);

            PDDocumentInformation info = document.getDocumentInformation();
            if (info != null) {
                if (info.getTitle() != null && !info.getTitle().isBlank()) {
                    content.getTechnicalMetadata().put("pdfTitle", info.getTitle().trim());
                }
                if (info.getAuthor() != null && !info.getAuthor().isBlank()) {
                    content.getTechnicalMetadata().put("pdfAuthor", info.getAuthor().trim());
                }
                if (info.getSubject() != null && !info.getSubject().isBlank()) {
                    content.getTechnicalMetadata().put("pdfSubject", info.getSubject().trim());
                }
            }

            return content;
        } catch (Exception e) {
            log.warn("Error extracting text from PDF: {}", e.getMessage());
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
