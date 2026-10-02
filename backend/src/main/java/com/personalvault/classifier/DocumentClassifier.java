package com.personalvault.classifier;

import com.personalvault.model.ClassificationResult;
import com.personalvault.model.ExtractedContent;

public interface DocumentClassifier {
    ClassificationResult classify(ExtractedContent content, String filename, String userEmail);
}
