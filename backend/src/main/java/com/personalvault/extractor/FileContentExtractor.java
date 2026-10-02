package com.personalvault.extractor;

import com.personalvault.model.ExtractedContent;

import java.io.File;
import java.io.IOException;

public interface FileContentExtractor {
    boolean supports(String contentType, String filename);
    ExtractedContent extract(File file, String filename, String contentType) throws IOException;
}
