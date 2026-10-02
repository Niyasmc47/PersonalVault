package com.personalvault.classifier;

import com.personalvault.model.ClassificationResult;
import com.personalvault.model.ExtractedContent;
import com.personalvault.model.SmartDropClassification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class CompositeDocumentClassifier implements DocumentClassifier {

    private static final Logger log = LoggerFactory.getLogger(CompositeDocumentClassifier.class);

    private final LocalRuleDocumentClassifier localClassifier;
    private final AIProvider aiProvider;

    public CompositeDocumentClassifier(LocalRuleDocumentClassifier localClassifier, AIProvider aiProvider) {
        this.localClassifier = localClassifier;
        this.aiProvider = aiProvider;
    }

    @Override
    public ClassificationResult classify(ExtractedContent content, String filename, String userEmail) {
        // Run high-precision local classification first
        ClassificationResult localResult = localClassifier.classify(content, filename, userEmail);

        // If local result is high confidence (e.g. >= 0.85), trust local result for maximum privacy & speed
        if (localResult != null && localResult.getConfidence() >= 0.85) {
            return localResult;
        }

        // If local confidence is moderate or unknown and AI Provider is available, consult AI Provider
        if (aiProvider != null && aiProvider.isAvailable()) {
            try {
                ClassificationResult aiResult = aiProvider.classifyWithAI(content, filename, userEmail);
                if (aiResult != null && aiResult.getClassification() != SmartDropClassification.UNKNOWN) {
                    return aiResult;
                }
            } catch (Exception e) {
                log.warn("AI Provider failed, using local rule fallback: {}", e.getMessage());
            }
        }

        return localResult != null ? localResult : new ClassificationResult();
    }
}
