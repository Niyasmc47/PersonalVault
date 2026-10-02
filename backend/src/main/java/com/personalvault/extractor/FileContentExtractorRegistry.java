package com.personalvault.extractor;

import com.personalvault.exception.InvalidRequestException;
import com.personalvault.model.ExtractedContent;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@Component
public class FileContentExtractorRegistry {

    private final List<FileContentExtractor> extractors;

    private static final Set<String> SUPPORTED_EXTENSIONS = Set.of(
            "pdf", "docx", "doc", "txt", "md", "csv", "json", "png", "jpg", "jpeg", "webp"
    );

    public FileContentExtractorRegistry(List<FileContentExtractor> extractors) {
        this.extractors = extractors;
    }

    public boolean isSupported(String contentType, String filename) {
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (SUPPORTED_EXTENSIONS.contains(ext)) {
                return true;
            }
        }
        for (FileContentExtractor extractor : extractors) {
            if (extractor.supports(contentType, filename)) {
                return true;
            }
        }
        return false;
    }

    public ExtractedContent extractContent(File file, String filename, String contentType) throws IOException {
        for (FileContentExtractor extractor : extractors) {
            if (extractor.supports(contentType, filename)) {
                return extractor.extract(file, filename, contentType);
            }
        }
        throw new InvalidRequestException("Unsupported file type for SmartDrop: " + (filename != null ? filename : contentType));
    }
}
