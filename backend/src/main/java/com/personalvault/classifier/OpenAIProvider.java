package com.personalvault.classifier;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personalvault.model.ClassificationResult;
import com.personalvault.model.ExtractedContent;
import com.personalvault.model.SmartDropClassification;
import com.personalvault.model.SmartDropDestination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Component
public class OpenAIProvider implements AIProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAIProvider.class);

    @Value("${ai.provider:local}")
    private String aiProvider;

    @Value("${openai.api.key:#{null}}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String modelName;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public boolean isAvailable() {
        return "openai".equalsIgnoreCase(aiProvider) && openAiApiKey != null && !openAiApiKey.isBlank();
    }

    @Override
    public ClassificationResult classifyWithAI(ExtractedContent content, String filename, String userEmail) {
        if (!isAvailable()) {
            return null;
        }

        try {
            String snippet = content.getFullText();
            if (snippet.length() > 2500) {
                snippet = snippet.substring(0, 2500);
            }

            String prompt = """
                    You are an intelligent document classifier for PersonalVault.
                    Analyze the following document text and classify it into one of the destinations:
                    - CERTIFICATES (for course completions, certifications, licenses)
                    - ACHIEVEMENTS (for hackathon awards, honors, competitions)
                    - PROJECTS (for project reports, software source documentation)
                    - SECURE_VAULT_IDENTITY (for Aadhaar, PAN, Passport, Driving Licence, Voter ID)
                    - SECURE_VAULT_FINANCIAL (for bank statements, account proofs)
                    - SECURE_VAULT_EDUCATION (for university degrees, marksheets, transcripts, student IDs)
                    - SECURE_VAULT_OTHER (for contracts, insurance, medical records)
                    - RESUME_BUILDER (for resumes/CVs)
                    - UNKNOWN

                    Return a JSON object with:
                    {
                      "classification": "CERTIFICATE | ACHIEVEMENT | PROJECT | IDENTITY_DOCUMENT | FINANCIAL_DOCUMENT | EDUCATIONAL_DOCUMENT | OTHER_DOCUMENT | RESUME | UNKNOWN",
                      "destination": "CERTIFICATES | ACHIEVEMENTS | PROJECTS | SECURE_VAULT_IDENTITY | SECURE_VAULT_FINANCIAL | SECURE_VAULT_EDUCATION | SECURE_VAULT_OTHER | RESUME_BUILDER | UNKNOWN",
                      "confidence": 0.95,
                      "explanation": "Short 1-sentence explanation",
                      "extractedFields": {
                         "title": "...",
                         "issuer": "...",
                         "issueDate": "YYYY-MM-DD",
                         "category": "..."
                      }
                    }

                    Document Text:
                    """ + snippet;

            Map<String, Object> message = Map.of("role", "user", "content", prompt);
            Map<String, Object> requestBodyMap = Map.of(
                    "model", modelName,
                    "messages", new Object[]{message},
                    "response_format", Map.of("type", "json_object"),
                    "temperature", 0.1
            );

            String requestJson = objectMapper.writeValueAsString(requestBodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                String responseText = root.path("choices").get(0).path("message").path("content").asText();
                JsonNode parsed = objectMapper.readTree(responseText);

                ClassificationResult result = new ClassificationResult();
                String classStr = parsed.path("classification").asText("UNKNOWN");
                String destStr = parsed.path("destination").asText("UNKNOWN");

                try {
                    result.setClassification(SmartDropClassification.valueOf(classStr));
                } catch (Exception e) {
                    result.setClassification(SmartDropClassification.UNKNOWN);
                }

                try {
                    result.setSuggestedDestination(SmartDropDestination.valueOf(destStr));
                } catch (Exception e) {
                    result.setSuggestedDestination(SmartDropDestination.UNKNOWN);
                }

                result.setConfidence(parsed.path("confidence").asDouble(0.85));
                result.setExplanation(parsed.path("explanation").asText("Analyzed using AI classification."));

                Map<String, Object> fields = new HashMap<>();
                JsonNode fieldsNode = parsed.path("extractedFields");
                if (fieldsNode.isObject()) {
                    fieldsNode.fields().forEachRemaining(entry -> {
                        if (entry.getValue().isTextual()) {
                            fields.put(entry.getKey(), entry.getValue().asText());
                        } else if (entry.getValue().isNumber()) {
                            fields.put(entry.getKey(), entry.getValue().numberValue());
                        } else if (entry.getValue().isBoolean()) {
                            fields.put(entry.getKey(), entry.getValue().asBoolean());
                        }
                    });
                }
                result.setExtractedFields(fields);

                return result;
            } else {
                log.warn("OpenAI API returned status {}", response.statusCode());
            }
        } catch (Exception e) {
            log.warn("AI Classification fallback triggered: {}", e.getMessage());
        }

        return null;
    }
}
