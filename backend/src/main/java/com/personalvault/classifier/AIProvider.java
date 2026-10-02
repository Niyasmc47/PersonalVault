package com.personalvault.classifier;

import com.personalvault.model.ClassificationResult;
import com.personalvault.model.ExtractedContent;

public interface AIProvider {
    boolean isAvailable();
    ClassificationResult classifyWithAI(ExtractedContent content, String filename, String userEmail);
}
