package com.personalvault.classifier;

import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.model.ClassificationResult;
import com.personalvault.model.ExtractedContent;
import com.personalvault.model.SmartDropClassification;
import com.personalvault.model.SmartDropDestination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class LocalRuleDocumentClassifier implements DocumentClassifier {

    private static final Logger log = LoggerFactory.getLogger(LocalRuleDocumentClassifier.class);

    // Regex patterns for Identity Documents
    private static final Pattern PAN_PATTERN = Pattern.compile("\\b[A-Z]{5}[0-9]{4}[A-Z]\\b");
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\b[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}\\b");
    private static final Pattern PASSPORT_PATTERN = Pattern.compile("\\b[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]\\b");
    private static final Pattern VOTER_ID_PATTERN = Pattern.compile("\\b[A-Z]{3}[0-9]{7}\\b");

    // Regex patterns for Financials
    private static final Pattern IFSC_PATTERN = Pattern.compile("\\b[A-Z]{4}0[A-Z0-9]{6}\\b");
    private static final Pattern UPI_PATTERN = Pattern.compile("\\b[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}\\b");
    private static final Pattern ACCOUNT_NO_PATTERN = Pattern.compile("(?i)(?:account\\s*(?:no|number|#)?[:.\\s]*)([0-9]{9,18})");

    // Regex patterns for Dates
    private static final Pattern DATE_PATTERN_1 = Pattern.compile("\\b(\\d{1,2})[-/.](\\d{1,2})[-/.](\\d{4})\\b");
    private static final Pattern DATE_PATTERN_2 = Pattern.compile("(?i)\\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{1,2},?\\s+\\d{4}\\b");

    @Override
    public ClassificationResult classify(ExtractedContent content, String filename, String userEmail) {
        String text = content != null && content.getFullText() != null ? content.getFullText() : "";
        String lowerText = text.toLowerCase(Locale.ROOT);
        String lowerName = filename != null ? filename.toLowerCase(Locale.ROOT) : "";

        // 1. Check for Resume / CV first
        ClassificationResult resumeCheck = evaluateResume(lowerText, text);
        if (resumeCheck != null && resumeCheck.getConfidence() >= 0.70) {
            return resumeCheck;
        }

        // 2. Check for Identity Documents (Secure Vault)
        ClassificationResult idCheck = evaluateIdentity(lowerText, text, content);
        if (idCheck != null && idCheck.getConfidence() >= 0.75) {
            return idCheck;
        }

        // 3. Check for Financial Documents (Secure Vault)
        ClassificationResult financialCheck = evaluateFinancial(lowerText, text);
        if (financialCheck != null && financialCheck.getConfidence() >= 0.70) {
            return financialCheck;
        }

        // 4. Check for Certificates
        ClassificationResult certCheck = evaluateCertificate(lowerText, text, lowerName, content);
        if (certCheck != null && certCheck.getConfidence() >= 0.70) {
            return certCheck;
        }

        // 5. Check for Educational Documents (Secure Vault)
        ClassificationResult eduCheck = evaluateEducation(lowerText, text);
        if (eduCheck != null && eduCheck.getConfidence() >= 0.70) {
            return eduCheck;
        }

        // 6. Check for Achievements
        ClassificationResult achieveCheck = evaluateAchievement(lowerText, text);
        if (achieveCheck != null && achieveCheck.getConfidence() >= 0.70) {
            return achieveCheck;
        }

        // 7. Check for Projects
        ClassificationResult projCheck = evaluateProject(lowerText, text);
        if (projCheck != null && projCheck.getConfidence() >= 0.65) {
            return projCheck;
        }

        // 8. Check for Other Documents (Secure Vault)
        ClassificationResult otherCheck = evaluateOtherDocument(lowerText, text);
        if (otherCheck != null && otherCheck.getConfidence() >= 0.65) {
            return otherCheck;
        }

        // Check if any partial candidate scored reasonably
        List<ClassificationResult> candidates = Arrays.asList(certCheck, idCheck, financialCheck, eduCheck, achieveCheck, projCheck, resumeCheck, otherCheck);
        ClassificationResult best = null;
        for (ClassificationResult c : candidates) {
            if (c != null && (best == null || c.getConfidence() > best.getConfidence())) {
                best = c;
            }
        }

        if (best != null && best.getConfidence() >= 0.45) {
            return best;
        }

        // Default Unknown Fallback
        ClassificationResult unknown = new ClassificationResult();
        unknown.setClassification(SmartDropClassification.UNKNOWN);
        unknown.setSuggestedDestination(SmartDropDestination.UNKNOWN);
        unknown.setConfidence(0.20);
        unknown.setExplanation("Unable to determine the document type with high confidence. Please choose where you would like to organize this file.");
        Map<String, Object> fallbackFields = new HashMap<>();
        fallbackFields.put("title", cleanTitleFromFilename(filename));
        unknown.setExtractedFields(fallbackFields);
        return unknown;
    }

    private ClassificationResult evaluateResume(String lowerText, String rawText) {
        int score = 0;
        List<String> foundSections = new ArrayList<>();

        if (lowerText.contains("curriculum vitae") || lowerText.contains("resume") || lowerText.contains("resumé")) {
            score += 35;
            foundSections.add("Resume Title");
        }
        if (lowerText.contains("experience") || lowerText.contains("work experience") || lowerText.contains("employment history")) {
            score += 20;
            foundSections.add("Experience");
        }
        if (lowerText.contains("education") || lowerText.contains("academic background")) {
            score += 20;
            foundSections.add("Education");
        }
        if (lowerText.contains("skills") || lowerText.contains("technical skills") || lowerText.contains("core competencies")) {
            score += 20;
            foundSections.add("Skills");
        }
        if (lowerText.contains("projects") || lowerText.contains("personal projects")) {
            score += 15;
            foundSections.add("Projects");
        }
        if (lowerText.contains("certifications") || lowerText.contains("achievements") || lowerText.contains("languages") || lowerText.contains("summary") || lowerText.contains("objective")) {
            score += 10;
            foundSections.add("Additional Sections");
        }

        if (score >= 45) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.RESUME);
            result.setSuggestedDestination(SmartDropDestination.RESUME_BUILDER);
            double conf = Math.min(0.98, 0.60 + (score * 0.005));
            result.setConfidence(conf);
            result.setExplanation("Detected as a Resume/CV containing sections: " + String.join(", ", foundSections) + ".");

            ResumeContentDTO resumeDto = parseResumeContent(rawText, lowerText);
            result.setResumeData(resumeDto);

            Map<String, Object> fields = new HashMap<>();
            fields.put("fullName", resumeDto.getPersonalInfo().getFullName());
            fields.put("email", resumeDto.getPersonalInfo().getEmail());
            fields.put("skillsCount", resumeDto.getSkills().size());
            fields.put("experienceCount", resumeDto.getExperience().size());
            fields.put("educationCount", resumeDto.getEducation().size());
            fields.put("projectsCount", resumeDto.getProjects().size());
            result.setExtractedFields(fields);

            return result;
        }
        return null;
    }

    private ClassificationResult evaluateIdentity(String lowerText, String rawText, ExtractedContent content) {
        ClassificationResult result = new ClassificationResult();
        result.setClassification(SmartDropClassification.IDENTITY_DOCUMENT);
        result.setSuggestedDestination(SmartDropDestination.SECURE_VAULT_IDENTITY);
        Map<String, Object> fields = new HashMap<>();

        // 1. Aadhaar
        if (lowerText.contains("unique identification authority of india") || lowerText.contains("uidai") ||
            lowerText.contains("aadhaar") || lowerText.contains("government of india") && lowerText.contains("enrollment")) {
            Matcher m = AADHAAR_PATTERN.matcher(rawText);
            String maskedNumber = "XXXX XXXX 1234";
            if (m.find()) {
                String found = m.group();
                maskedNumber = "XXXX XXXX " + found.substring(Math.max(0, found.length() - 4));
            }
            fields.put("documentType", "AADHAAR");
            fields.put("holderName", extractProbableName(rawText));
            fields.put("documentNumber", maskedNumber);
            result.setConfidence(0.96);
            result.setExplanation("Detected as an Aadhaar Identity Card from government authority markers and document layout.");
            result.setExtractedFields(fields);
            return result;
        }

        // 2. PAN Card
        if (lowerText.contains("income tax department") || lowerText.contains("permanent account number") || lowerText.contains("pan card")) {
            Matcher m = PAN_PATTERN.matcher(rawText);
            String maskedPan = "XXXXX1234X";
            if (m.find()) {
                String found = m.group();
                maskedPan = "XXXXX" + found.substring(Math.max(0, found.length() - 4));
            }
            fields.put("documentType", "PAN");
            fields.put("holderName", extractProbableName(rawText));
            fields.put("documentNumber", maskedPan);
            result.setConfidence(0.95);
            result.setExplanation("Detected as a PAN Identity Card with Permanent Account Number structure.");
            result.setExtractedFields(fields);
            return result;
        }

        // 3. Passport
        if (lowerText.contains("passport") && (lowerText.contains("republic of india") || lowerText.contains("given name") || lowerText.contains("surname") || lowerText.contains("nationality"))) {
            Matcher m = PASSPORT_PATTERN.matcher(rawText);
            String maskedPass = "X1234567";
            if (m.find()) {
                String found = m.group();
                maskedPass = found.charAt(0) + "XXXX" + found.substring(Math.max(1, found.length() - 3));
            }
            fields.put("documentType", "PASSPORT");
            fields.put("holderName", extractProbableName(rawText));
            fields.put("documentNumber", maskedPass);
            result.setConfidence(0.94);
            result.setExplanation("Detected as a Passport document containing travel credential identifiers.");
            result.setExtractedFields(fields);
            return result;
        }

        // 4. Driving Licence
        if (lowerText.contains("driving licence") || lowerText.contains("driving license") || lowerText.contains("motor vehicles department") || lowerText.contains("licence to drive")) {
            fields.put("documentType", "DRIVING_LICENCE");
            fields.put("holderName", extractProbableName(rawText));
            fields.put("documentNumber", "DL-XXXXXXXXXXXX");
            result.setConfidence(0.92);
            result.setExplanation("Detected as a Driving Licence document.");
            result.setExtractedFields(fields);
            return result;
        }

        // 5. Voter ID
        if (lowerText.contains("election commission of india") || lowerText.contains("voter id") || lowerText.contains("epic no") || lowerText.contains("elector")) {
            fields.put("documentType", "VOTER_ID");
            fields.put("holderName", extractProbableName(rawText));
            fields.put("documentNumber", "ABC1234567");
            result.setConfidence(0.92);
            result.setExplanation("Detected as an Election Commission Voter ID document.");
            result.setExtractedFields(fields);
            return result;
        }

        // Image Aspect Ratio candidate
        if (content != null && content.getTechnicalMetadata().containsKey("idCardLayoutCandidate")) {
            fields.put("documentType", "OTHER");
            fields.put("holderName", "Card Holder");
            result.setConfidence(0.65);
            result.setExplanation("Image format matches standard identification card dimensions.");
            result.setExtractedFields(fields);
            return result;
        }

        return null;
    }

    private ClassificationResult evaluateFinancial(String lowerText, String rawText) {
        int score = 0;
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("account statement") || lowerText.contains("bank statement") || lowerText.contains("statement of account")) {
            score += 35;
            markers.add("Bank Statement Header");
        }
        if (lowerText.contains("opening balance") || lowerText.contains("closing balance") || lowerText.contains("available balance")) {
            score += 25;
            markers.add("Balance Summary");
        }
        if (lowerText.contains("ifsc") || IFSC_PATTERN.matcher(rawText).find()) {
            score += 20;
            markers.add("IFSC Code");
        }
        if (lowerText.contains("account number") || lowerText.contains("a/c no") || lowerText.contains("account no")) {
            score += 20;
            markers.add("Account Number");
        }
        if (lowerText.contains("debit") && lowerText.contains("credit") && lowerText.contains("transaction date")) {
            score += 20;
            markers.add("Transaction Table");
        }

        String bankName = extractBankName(lowerText);
        if (bankName != null) {
            score += 15;
            markers.add(bankName);
        }

        if (score >= 40) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.FINANCIAL_DOCUMENT);
            result.setSuggestedDestination(SmartDropDestination.SECURE_VAULT_FINANCIAL);
            result.setConfidence(Math.min(0.97, 0.65 + (score * 0.004)));
            result.setExplanation("Detected as a Financial/Bank Document based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            fields.put("bankName", bankName != null ? bankName : "Bank");
            fields.put("accountType", lowerText.contains("current") ? "CURRENT" : "SAVINGS");
            fields.put("accountNumber", "XXXXXXXX1234");
            fields.put("branch", "Main Branch");

            Matcher ifscMatcher = IFSC_PATTERN.matcher(rawText);
            if (ifscMatcher.find()) {
                fields.put("ifsc", ifscMatcher.group());
            }

            Matcher upiMatcher = UPI_PATTERN.matcher(rawText);
            if (upiMatcher.find()) {
                fields.put("upiId", upiMatcher.group());
            }

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    private ClassificationResult evaluateCertificate(String lowerText, String rawText, String lowerFilename, ExtractedContent content) {
        int score = 0;
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("certificate of completion") || lowerText.contains("certificate of achievement") ||
            lowerText.contains("this is to certify that") || lowerText.contains("has successfully completed") ||
            lowerText.contains("awarded to") || lowerText.contains("certifies that")) {
            score += 45;
            markers.add("Certificate Certification Text");
        }
        if (lowerText.contains("credential id") || lowerText.contains("certificate id") || lowerText.contains("verification url") || lowerText.contains("verify at")) {
            score += 20;
            markers.add("Credential Verification Markers");
        }
        if (lowerText.contains("authorized signatory") || lowerText.contains("course instructor") || lowerText.contains("director") || lowerText.contains("issued on")) {
            score += 15;
            markers.add("Signature/Issue Date");
        }
        if (lowerText.contains("coursera") || lowerText.contains("udemy") || lowerText.contains("edx") ||
            lowerText.contains("amazon web services") || lowerText.contains("aws certified") ||
            lowerText.contains("google cloud") || lowerText.contains("microsoft certified") ||
            lowerText.contains("hackerrank") || lowerText.contains("freecodecamp") || lowerText.contains("oracle certified")) {
            score += 25;
            markers.add("Accredited Certification Provider");
        }

        // Visual layout candidate
        if (content != null && content.getTechnicalMetadata().containsKey("landscapeCertificateCandidate")) {
            score += 10;
        }

        if (score >= 40) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.CERTIFICATE);
            result.setSuggestedDestination(SmartDropDestination.CERTIFICATES);
            result.setConfidence(Math.min(0.98, 0.65 + (score * 0.004)));
            result.setExplanation("Detected as a Certificate based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            String extractedTitle = extractCertificateTitle(rawText);
            fields.put("title", extractedTitle != null ? extractedTitle : "Course Certificate");
            String extractedIssuer = extractIssuer(lowerText, rawText);
            fields.put("issuer", extractedIssuer != null ? extractedIssuer : "Certification Authority");
            fields.put("category", determineCertificateCategory(lowerText));
            fields.put("issueDate", extractDateOrDefault(rawText));
            fields.put("credentialId", extractCredentialId(rawText));

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    private ClassificationResult evaluateEducation(String lowerText, String rawText) {
        int score = 0;
        String docCategory = "DEGREE";
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("marksheet") || lowerText.contains("mark sheet") || lowerText.contains("grade sheet") || lowerText.contains("statement of marks")) {
            score += 40;
            docCategory = "MARK_SHEET";
            markers.add("Marksheet/Grade Report");
        } else if (lowerText.contains("transcript") || lowerText.contains("academic transcript")) {
            score += 40;
            docCategory = "TRANSCRIPT";
            markers.add("Academic Transcript");
        } else if (lowerText.contains("degree") || lowerText.contains("bachelor of") || lowerText.contains("master of") || lowerText.contains("diploma in") || lowerText.contains("doctor of philosophy")) {
            score += 40;
            docCategory = "DEGREE";
            markers.add("University Degree / Diploma");
        } else if (lowerText.contains("student id") || lowerText.contains("identity card") && lowerText.contains("college") || lowerText.contains("university")) {
            score += 35;
            docCategory = "STUDENT_ID";
            markers.add("Student ID");
        } else if (lowerText.contains("offer letter") || lowerText.contains("appointment letter") || lowerText.contains("employment offer")) {
            score += 40;
            docCategory = "OFFER_LETTER";
            markers.add("Offer Letter");
        } else if (lowerText.contains("internship certificate") || lowerText.contains("internship completion")) {
            score += 40;
            docCategory = "INTERNSHIP_CERTIFICATE";
            markers.add("Internship Certificate");
        }

        if (lowerText.contains("semester") || lowerText.contains("cgpa") || lowerText.contains("gpa") || lowerText.contains("credits") || lowerText.contains("controller of examinations")) {
            score += 20;
            markers.add("Academic Evaluation Details");
        }
        if (lowerText.contains("university") || lowerText.contains("institute of technology") || lowerText.contains("board of education") || lowerText.contains("college")) {
            score += 15;
            markers.add("Educational Institution");
        }

        if (score >= 40) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.EDUCATIONAL_DOCUMENT);
            result.setSuggestedDestination(SmartDropDestination.SECURE_VAULT_EDUCATION);
            result.setConfidence(Math.min(0.96, 0.65 + (score * 0.004)));
            result.setExplanation("Detected as an Educational Document (" + docCategory + ") based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            fields.put("title", extractEducationTitle(rawText, docCategory));
            fields.put("institution", extractInstitution(rawText));
            fields.put("category", docCategory);
            fields.put("section", "EDUCATION");
            fields.put("issueDate", extractDateOrDefault(rawText));

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    private ClassificationResult evaluateAchievement(String lowerText, String rawText) {
        int score = 0;
        String category = "HACKATHON";
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("hackathon") || lowerText.contains("hack night") || lowerText.contains("codeathon")) {
            score += 40;
            category = "HACKATHON";
            markers.add("Hackathon Event");
        }
        if (lowerText.contains("1st place") || lowerText.contains("first place") || lowerText.contains("winner") || lowerText.contains("champion") ||
            lowerText.contains("2nd place") || lowerText.contains("runner up") || lowerText.contains("special mention") || lowerText.contains("award")) {
            score += 35;
            markers.add("Award / Winning Placement");
        }
        if (lowerText.contains("dean's list") || lowerText.contains("merit award") || lowerText.contains("scholarship")) {
            score += 30;
            category = "ACADEMIC";
            markers.add("Academic Honor");
        }

        if (score >= 45) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.ACHIEVEMENT);
            result.setSuggestedDestination(SmartDropDestination.ACHIEVEMENTS);
            result.setConfidence(Math.min(0.95, 0.65 + (score * 0.004)));
            result.setExplanation("Detected as a Notable Achievement based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            fields.put("title", extractAchievementTitle(rawText));
            fields.put("organization", extractOrganization(rawText));
            fields.put("category", category);
            fields.put("achievementDate", extractDateOrDefault(rawText));
            fields.put("description", rawText.length() > 200 ? rawText.substring(0, 200) : rawText);

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    private ClassificationResult evaluateProject(String lowerText, String rawText) {
        int score = 0;
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("project report") || lowerText.contains("abstract") && lowerText.contains("problem statement") || lowerText.contains("system architecture")) {
            score += 35;
            markers.add("Project Documentation Format");
        }
        if (lowerText.contains("github.com") || lowerText.contains("repository") || lowerText.contains("tech stack") || lowerText.contains("technologies used")) {
            score += 30;
            markers.add("Technical Implementation & GitHub Links");
        }
        if (lowerText.contains("react") || lowerText.contains("spring boot") || lowerText.contains("python") || lowerText.contains("postgresql") || lowerText.contains("docker") || lowerText.contains("tensorflow") || lowerText.contains("nodejs")) {
            score += 20;
            markers.add("Software Technologies");
        }

        if (score >= 45) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.PROJECT);
            result.setSuggestedDestination(SmartDropDestination.PROJECTS);
            result.setConfidence(Math.min(0.92, 0.60 + (score * 0.004)));
            result.setExplanation("Detected as a Software / Academic Project based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            fields.put("title", extractProjectTitle(rawText));
            fields.put("description", rawText.length() > 300 ? rawText.substring(0, 300) : rawText);
            fields.put("category", determineProjectCategory(lowerText));
            fields.put("status", "COMPLETED");
            fields.put("technologies", extractTechnologiesList(lowerText));

            // GitHub url
            Matcher m = Pattern.compile("https?://github\\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+").matcher(rawText);
            if (m.find()) {
                fields.put("githubUrl", m.group());
            }

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    private ClassificationResult evaluateOtherDocument(String lowerText, String rawText) {
        int score = 0;
        String category = "OTHER";
        List<String> markers = new ArrayList<>();

        if (lowerText.contains("insurance policy") || lowerText.contains("policyholder") || lowerText.contains("sum insured") || lowerText.contains("premium")) {
            score += 35;
            category = "INSURANCE";
            markers.add("Insurance Policy Markers");
        } else if (lowerText.contains("agreement") || lowerText.contains("contract") || lowerText.contains("terms and conditions") || lowerText.contains("between the parties")) {
            score += 35;
            category = "CONTRACT";
            markers.add("Contract / Agreement Clauses");
        } else if (lowerText.contains("lease agreement") || lowerText.contains("rent agreement") || lowerText.contains("premises") || lowerText.contains("landlord")) {
            score += 35;
            category = "PROPERTY";
            markers.add("Property / Lease Documentation");
        } else if (lowerText.contains("hospital") || lowerText.contains("patient name") || lowerText.contains("medical prescription") || lowerText.contains("diagnosis") || lowerText.contains("dr.")) {
            score += 35;
            category = "MEDICAL";
            markers.add("Medical Record Markers");
        }

        if (score >= 35) {
            ClassificationResult result = new ClassificationResult();
            result.setClassification(SmartDropClassification.OTHER_DOCUMENT);
            result.setSuggestedDestination(SmartDropDestination.SECURE_VAULT_OTHER);
            result.setConfidence(Math.min(0.90, 0.60 + (score * 0.005)));
            result.setExplanation("Detected as a Protected Personal Document (" + category + ") based on: " + String.join(", ", markers) + ".");

            Map<String, Object> fields = new HashMap<>();
            fields.put("title", cleanTitleFromText(rawText, category));
            fields.put("issuer", "Issuer / Authority");
            fields.put("category", category);
            fields.put("section", "OTHER");
            fields.put("issueDate", extractDateOrDefault(rawText));

            result.setExtractedFields(fields);
            return result;
        }
        return null;
    }

    // Helper parsers
    private ResumeContentDTO parseResumeContent(String rawText, String lowerText) {
        ResumeContentDTO resume = new ResumeContentDTO();
        ResumeContentDTO.PersonalInfoDTO personal = resume.getPersonalInfo();

        // Email
        Matcher emailMatcher = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}").matcher(rawText);
        if (emailMatcher.find()) {
            personal.setEmail(emailMatcher.group());
        }

        // Phone
        Matcher phoneMatcher = Pattern.compile("(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}").matcher(rawText);
        if (phoneMatcher.find()) {
            personal.setPhone(phoneMatcher.group());
        }

        // Name: first non-empty line
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 2 && trimmed.length() < 40 && !trimmed.toLowerCase().contains("resume") && !trimmed.toLowerCase().contains("cv")) {
                personal.setFullName(trimmed);
                break;
            }
        }
        if (personal.getFullName() == null || personal.getFullName().isBlank()) {
            personal.setFullName("Resume Candidate");
        }

        // Skills
        List<String> detectedTech = extractTechnologiesList(lowerText);
        for (String tech : detectedTech) {
            ResumeContentDTO.ResumeSkillDTO skillDto = new ResumeContentDTO.ResumeSkillDTO();
            skillDto.setName(tech);
            skillDto.setCategory(com.personalvault.entity.SkillCategory.PROGRAMMING_LANGUAGE);
            skillDto.setProficiency(com.personalvault.entity.ProficiencyLevel.INTERMEDIATE);
            resume.getSkills().add(skillDto);
        }

        return resume;
    }

    private List<String> extractTechnologiesList(String lowerText) {
        List<String> found = new ArrayList<>();
        String[] techBank = {
            "Java", "Spring Boot", "Python", "React", "TypeScript", "JavaScript", "HTML", "CSS",
            "Node.js", "Express", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
            "AWS", "GCP", "Azure", "Git", "GitHub", "REST API", "GraphQL", "Tailwind CSS", "C++", "C#",
            "Go", "Rust", "Kotlin", "Swift", "Flutter", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"
        };
        for (String tech : techBank) {
            if (lowerText.contains(tech.toLowerCase())) {
                found.add(tech);
            }
        }
        return found;
    }

    private String extractBankName(String lowerText) {
        String[] banks = {"HDFC Bank", "State Bank of India", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Union Bank", "Citibank", "Chase", "HSBC", "Wells Fargo", "Bank of America"};
        for (String bank : banks) {
            if (lowerText.contains(bank.toLowerCase())) {
                return bank;
            }
        }
        return null;
    }

    private String extractCertificateTitle(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.toLowerCase().contains("certificate of") || line.toLowerCase().contains("certifies that")) {
                if (i + 1 < lines.length && !lines[i + 1].isBlank()) {
                    return lines[i + 1].trim();
                }
                return line;
            }
        }
        return "Professional Certificate";
    }

    private String extractIssuer(String lowerText, String rawText) {
        String[] issuers = {"Amazon Web Services", "AWS", "Google Cloud", "Microsoft", "Coursera", "Udemy", "edX", "HackerRank", "Oracle", "Cisco", "Meta", "IBM", "Stanford University", "Harvard University", "freeCodeCamp"};
        for (String iss : issuers) {
            if (lowerText.contains(iss.toLowerCase())) {
                return iss;
            }
        }
        return "Certification Authority";
    }

    private String determineCertificateCategory(String lowerText) {
        if (lowerText.contains("aws") || lowerText.contains("cloud") || lowerText.contains("developer") || lowerText.contains("programming") || lowerText.contains("security")) {
            return "TECHNICAL";
        }
        if (lowerText.contains("university") || lowerText.contains("academic") || lowerText.contains("degree")) {
            return "ACADEMIC";
        }
        if (lowerText.contains("workshop") || lowerText.contains("bootcamp")) {
            return "WORKSHOP";
        }
        return "PROFESSIONAL";
    }

    private String determineProjectCategory(String lowerText) {
        if (lowerText.contains("mobile") || lowerText.contains("android") || lowerText.contains("ios") || lowerText.contains("flutter")) {
            return "MOBILE_APP";
        }
        if (lowerText.contains("machine learning") || lowerText.contains("ai") || lowerText.contains("neural network") || lowerText.contains("model")) {
            return "MACHINE_LEARNING";
        }
        if (lowerText.contains("cloud") || lowerText.contains("devops") || lowerText.contains("docker")) {
            return "CLOUD_DEVOPS";
        }
        return "WEB_DEVELOPMENT";
    }

    private String extractDateOrDefault(String rawText) {
        Matcher m1 = DATE_PATTERN_1.matcher(rawText);
        if (m1.find()) {
            try {
                int d = Integer.parseInt(m1.group(1));
                int m = Integer.parseInt(m1.group(2));
                int y = Integer.parseInt(m1.group(3));
                if (m > 12 && d <= 12) { // swapped MM/DD/YYYY
                    int tmp = d; d = m; m = tmp;
                }
                return String.format("%04d-%02d-%02d", y, Math.min(12, Math.max(1, m)), Math.min(28, Math.max(1, d)));
            } catch (Exception ignored) {}
        }
        return LocalDate.now().toString();
    }

    private String extractCredentialId(String rawText) {
        Matcher m = Pattern.compile("(?i)(?:credential\\s*(?:id|#)?|certificate\\s*id)[:.\\s]*([A-Za-z0-9-_]{6,30})").matcher(rawText);
        if (m.find()) {
            return m.group(1);
        }
        return null;
    }

    private String extractProbableName(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() >= 3 && trimmed.length() <= 30 && trimmed.matches("^[a-zA-Z\\s.]+$")) {
                if (!trimmed.equalsIgnoreCase("government of india") && !trimmed.equalsIgnoreCase("income tax department")) {
                    return trimmed;
                }
            }
        }
        return "Card Holder";
    }

    private String extractEducationTitle(String rawText, String docCategory) {
        if (docCategory.equals("MARK_SHEET")) return "Semester Grade Marksheet";
        if (docCategory.equals("TRANSCRIPT")) return "Official Academic Transcript";
        if (docCategory.equals("DEGREE")) return "Bachelor Degree Certificate";
        if (docCategory.equals("OFFER_LETTER")) return "Employment Offer Letter";
        if (docCategory.equals("INTERNSHIP_CERTIFICATE")) return "Internship Certificate";
        return "Educational Document";
    }

    private String extractInstitution(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            if (line.toLowerCase().contains("university") || line.toLowerCase().contains("college") || line.toLowerCase().contains("institute")) {
                return line.trim();
            }
        }
        return "Educational Institution";
    }

    private String extractAchievementTitle(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            if (line.toLowerCase().contains("winner") || line.toLowerCase().contains("hackathon") || line.toLowerCase().contains("place") || line.toLowerCase().contains("award")) {
                return line.trim();
            }
        }
        return "Hackathon Achievement";
    }

    private String extractOrganization(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            if (line.toLowerCase().contains("organized by") || line.toLowerCase().contains("hosted by") || line.toLowerCase().contains("association")) {
                return line.replace("Organized by", "").replace("Hosted by", "").trim();
            }
        }
        return "Event Organizer";
    }

    private String extractProjectTitle(String rawText) {
        String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 3 && trimmed.length() < 50 && !trimmed.toLowerCase().contains("project report") && !trimmed.toLowerCase().contains("abstract")) {
                return trimmed;
            }
        }
        return "Software Application Project";
    }

    private String cleanTitleFromText(String rawText, String category) {
        return category.substring(0, 1) + category.substring(1).toLowerCase() + " Document";
    }

    private String cleanTitleFromFilename(String filename) {
        if (filename == null || filename.isBlank()) return "Uploaded Document";
        int dot = filename.lastIndexOf('.');
        String base = dot > 0 ? filename.substring(0, dot) : filename;
        base = base.replace('_', ' ').replace('-', ' ').replaceAll("[^a-zA-Z0-9\\s]", "");
        return base.trim().isEmpty() ? "Uploaded Document" : base.trim();
    }
}
