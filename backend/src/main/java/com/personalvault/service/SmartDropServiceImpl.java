package com.personalvault.service;

import com.personalvault.dto.CreateAchievementRequest;
import com.personalvault.dto.CreateCertificateRequest;
import com.personalvault.dto.CreateProjectRequest;
import com.personalvault.dto.CreateResumeRequest;
import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.dto.CreateSkillRequest;
import com.personalvault.dto.*;
import com.personalvault.entity.AchievementCategory;
import com.personalvault.entity.User;
import com.personalvault.entity.CertificateCategory;
import com.personalvault.entity.ProjectCategory;
import com.personalvault.entity.ProjectStatus;
import com.personalvault.entity.ResumeTemplate;
import com.personalvault.entity.ProficiencyLevel;
import com.personalvault.entity.SkillCategory;
import com.personalvault.entity.FinancialAccountType;
import com.personalvault.entity.IdentityDocumentType;
import com.personalvault.entity.VaultDocumentCategory;
import com.personalvault.entity.VaultDocumentSection;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.repository.UserRepository;
import com.personalvault.service.AchievementService;
import com.personalvault.service.CertificateService;
import com.personalvault.service.ProjectService;
import com.personalvault.service.ResumeService;
import com.personalvault.service.SkillService;
import com.personalvault.service.VaultDocumentService;
import com.personalvault.service.VaultFinancialAccountService;
import com.personalvault.service.VaultIdentityDocumentService;
import com.personalvault.classifier.DocumentClassifier;
import com.personalvault.dto.*;
import com.personalvault.extractor.FileContentExtractorRegistry;
import com.personalvault.model.*;
import com.personalvault.util.TempFileMultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
public class SmartDropServiceImpl implements SmartDropService {

    private static final Logger log = LoggerFactory.getLogger(SmartDropServiceImpl.class);

    private final SmartDropStorageService storageService;
    private final FileContentExtractorRegistry extractorRegistry;
    private final DocumentClassifier documentClassifier;
    private final SmartDropDuplicateService duplicateService;
    private final UserRepository userRepository;

    private final CertificateService certificateService;
    private final ProjectService projectService;
    private final AchievementService achievementService;
    private final VaultIdentityDocumentService vaultIdentityDocumentService;
    private final VaultFinancialAccountService vaultFinancialAccountService;
    private final VaultDocumentService vaultDocumentService;
    private final ResumeService resumeService;
    private final SkillService skillService;

    public SmartDropServiceImpl(SmartDropStorageService storageService,
                                FileContentExtractorRegistry extractorRegistry,
                                DocumentClassifier documentClassifier,
                                SmartDropDuplicateService duplicateService,
                                UserRepository userRepository,
                                CertificateService certificateService,
                                ProjectService projectService,
                                AchievementService achievementService,
                                VaultIdentityDocumentService vaultIdentityDocumentService,
                                VaultFinancialAccountService vaultFinancialAccountService,
                                VaultDocumentService vaultDocumentService,
                                ResumeService resumeService,
                                SkillService skillService) {
        this.storageService = storageService;
        this.extractorRegistry = extractorRegistry;
        this.documentClassifier = documentClassifier;
        this.duplicateService = duplicateService;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
        this.projectService = projectService;
        this.achievementService = achievementService;
        this.vaultIdentityDocumentService = vaultIdentityDocumentService;
        this.vaultFinancialAccountService = vaultFinancialAccountService;
        this.vaultDocumentService = vaultDocumentService;
        this.resumeService = resumeService;
        this.skillService = skillService;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public List<SmartDropAnalysisResponse> analyzeFiles(String userEmail, List<MultipartFile> files) {
        User user = getAuthenticatedUser(userEmail);
        List<SmartDropAnalysisResponse> results = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            throw new InvalidRequestException("No files provided for SmartDrop analysis.");
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;

            String originalFilename = file.getOriginalFilename();
            String contentType = file.getContentType();

            if (!extractorRegistry.isSupported(contentType, originalFilename)) {
                throw new InvalidRequestException("File format not supported: " + originalFilename + " (" + contentType + ")");
            }

            try {
                // 1. Store temporary upload
                TempUploadedFile tempFile = storageService.storeTempFile(userEmail, file);

                // 2. Extract content
                ExtractedContent extractedContent = extractorRegistry.extractContent(tempFile.getTempFile(), originalFilename, contentType);
                tempFile.setExtractedContent(extractedContent);

                // 3. Classify content
                ClassificationResult classificationResult = documentClassifier.classify(extractedContent, originalFilename, userEmail);

                // 4. Check for duplicates
                duplicateService.checkAndFlagDuplicates(user, classificationResult);
                tempFile.setClassificationResult(classificationResult);

                // 5. Build response DTO
                SmartDropAnalysisResponse response = new SmartDropAnalysisResponse();
                response.setTempFileId(tempFile.getTempId());
                response.setFileName(originalFilename);
                response.setFileSize(file.getSize());
                response.setContentType(contentType);
                response.setClassification(classificationResult.getClassification());
                response.setSuggestedDestination(classificationResult.getSuggestedDestination());
                response.setConfidence(classificationResult.getConfidence());
                response.setConfidenceLevel(classificationResult.getConfidenceLevel());
                response.setExplanation(classificationResult.getExplanation());
                response.setExtractedMetadata(classificationResult.getExtractedFields());
                response.setResumeData(classificationResult.getResumeData());
                response.setTextSnippet(extractedContent.getRawSnippet());
                response.setDuplicateWarning(classificationResult.isDuplicate());
                response.setDuplicateMessage(classificationResult.getDuplicateMessage());
                response.setDuplicateExistingId(classificationResult.getDuplicateExistingId());

                results.add(response);
            } catch (IOException e) {
                log.error("Failed to process SmartDrop upload: {}", e.getMessage());
                throw new InvalidRequestException("Failed to analyze file " + originalFilename + ": " + e.getMessage());
            }
        }

        return results;
    }

    @Override
    public Resource previewTempFile(String userEmail, String tempFileId) {
        TempUploadedFile temp = storageService.getTempFile(tempFileId, userEmail);
        return new FileSystemResource(temp.getTempFile());
    }

    @Override
    public SmartDropConfirmResponse confirmAndRoute(String userEmail, SmartDropConfirmRequest request, String vaultToken) {
        TempUploadedFile temp = storageService.getTempFile(request.getTempFileId(), userEmail);
        Map<String, Object> meta = request.getMetadata() != null ? request.getMetadata() : new HashMap<>();
        SmartDropDestination dest = request.getDestination();

        TempFileMultipartFile multipartFile = new TempFileMultipartFile(
                temp.getTempFile(), temp.getOriginalFilename(), temp.getContentType()
        );

        SmartDropConfirmResponse response = new SmartDropConfirmResponse();
        response.setDestination(dest);

        try {
            switch (dest) {
                case CERTIFICATES -> {
                    CreateCertificateRequest certReq = new CreateCertificateRequest();
                    certReq.setTitle(getStringMeta(meta, "title", "Certificate"));
                    certReq.setIssuer(getStringMeta(meta, "issuer", "Certification Authority"));
                    certReq.setDescription(getStringMeta(meta, "description", null));
                    certReq.setCategory(parseEnum(CertificateCategory.class, getStringMeta(meta, "category", "COURSE"), CertificateCategory.COURSE));
                    certReq.setIssueDate(parseDate(getStringMeta(meta, "issueDate", null)));
                    if (meta.containsKey("expiryDate") && meta.get("expiryDate") != null) {
                        certReq.setExpiryDate(parseDate(getStringMeta(meta, "expiryDate", null)));
                    }
                    certReq.setCredentialId(getStringMeta(meta, "credentialId", null));
                    certReq.setCredentialUrl(getStringMeta(meta, "credentialUrl", null));
                    certReq.setFile(multipartFile);

                    Object created = certificateService.createCertificate(userEmail, certReq);
                    response.setSuccess(true);
                    response.setMessage("Certificate added successfully to Certificates.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/certificates");
                }
                case PROJECTS -> {
                    CreateProjectRequest projReq = new CreateProjectRequest();
                    projReq.setTitle(getStringMeta(meta, "title", "Project"));
                    projReq.setDescription(getStringMeta(meta, "description", "Project documentation."));
                    projReq.setCategory(parseEnum(ProjectCategory.class, getStringMeta(meta, "category", "PERSONAL"), ProjectCategory.PERSONAL));
                    projReq.setStatus(parseEnum(ProjectStatus.class, getStringMeta(meta, "status", "COMPLETED"), ProjectStatus.COMPLETED));
                    projReq.setGithubUrl(getStringMeta(meta, "githubUrl", null));
                    projReq.setLiveUrl(getStringMeta(meta, "liveUrl", null));

                    if (meta.containsKey("technologies") && meta.get("technologies") instanceof List<?> list) {
                        List<String> techList = new ArrayList<>();
                        for (Object o : list) if (o != null) techList.add(o.toString());
                        projReq.setTechnologies(techList);
                    } else if (meta.containsKey("technologies") && meta.get("technologies") instanceof String str) {
                        projReq.setTechnologies(Arrays.stream(str.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
                    }

                    Object created = projectService.createProject(userEmail, projReq);
                    response.setSuccess(true);
                    response.setMessage("Project added successfully to your Projects portfolio.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/projects");
                }
                case ACHIEVEMENTS -> {
                    CreateAchievementRequest achReq = new CreateAchievementRequest();
                    achReq.setTitle(getStringMeta(meta, "title", "Achievement"));
                    achReq.setOrganization(getStringMeta(meta, "organization", "Organization"));
                    achReq.setDescription(getStringMeta(meta, "description", null));
                    achReq.setCategory(parseEnum(AchievementCategory.class, getStringMeta(meta, "category", "HACKATHON"), AchievementCategory.HACKATHON));
                    achReq.setAchievementDate(parseDate(getStringMeta(meta, "achievementDate", null)));
                    achReq.setUrl(getStringMeta(meta, "url", null));

                    Object created = achievementService.createAchievement(userEmail, achReq);
                    response.setSuccess(true);
                    response.setMessage("Achievement added successfully to Achievements.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/achievements");
                }
                case SECURE_VAULT_IDENTITY -> {
                    CreateIdentityDocumentRequest idReq = new CreateIdentityDocumentRequest();
                    idReq.setType(parseEnum(IdentityDocumentType.class, getStringMeta(meta, "documentType", "OTHER"), IdentityDocumentType.OTHER));
                    idReq.setHolderName(getStringMeta(meta, "holderName", "Card Holder"));
                    idReq.setDocumentNumber(getStringMeta(meta, "documentNumber", "ID-" + UUID.randomUUID().toString().substring(0, 8)));
                    idReq.setNotes(getStringMeta(meta, "notes", "Imported via SmartDrop"));
                    idReq.setFrontFile(multipartFile);

                    Object created = vaultIdentityDocumentService.createIdentityDocument(userEmail, idReq);
                    response.setSuccess(true);
                    response.setMessage("Document added to Secure Vault → Identity Documents.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/vault");
                }
                case SECURE_VAULT_FINANCIAL -> {
                    CreateFinancialAccountRequest finReq = new CreateFinancialAccountRequest();
                    finReq.setBankName(getStringMeta(meta, "bankName", "Bank Account"));
                    finReq.setAccountNumber(getStringMeta(meta, "accountNumber", "ACC" + UUID.randomUUID().toString().substring(0, 8)));
                    finReq.setIfsc(getStringMeta(meta, "ifsc", null));
                    finReq.setBranch(getStringMeta(meta, "branch", null));
                    finReq.setUpiId(getStringMeta(meta, "upiId", null));
                    finReq.setAccountType(parseEnum(FinancialAccountType.class, getStringMeta(meta, "accountType", "SAVINGS"), FinancialAccountType.SAVINGS));
                    finReq.setNotes(getStringMeta(meta, "notes", "Imported via SmartDrop"));
                    finReq.setFile(multipartFile);

                    Object created = vaultFinancialAccountService.createAccount(userEmail, finReq);
                    response.setSuccess(true);
                    response.setMessage("Document added to Secure Vault → Financial Information.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/vault");
                }
                case SECURE_VAULT_EDUCATION, SECURE_VAULT_OTHER -> {
                    VaultDocumentSection section = dest == SmartDropDestination.SECURE_VAULT_EDUCATION ? VaultDocumentSection.EDUCATION : VaultDocumentSection.OTHER;
                    CreateVaultDocumentRequest docReq = new CreateVaultDocumentRequest();
                    docReq.setSection(section);
                    docReq.setCategory(parseEnum(VaultDocumentCategory.class, getStringMeta(meta, "category", section == VaultDocumentSection.EDUCATION ? "DEGREE" : "OTHER"), VaultDocumentCategory.OTHER));
                    docReq.setTitle(getStringMeta(meta, "title", "Document"));
                    docReq.setIssuerOrInstitution(getStringMeta(meta, "institution", getStringMeta(meta, "issuer", null)));
                    docReq.setDocumentIdentifier(getStringMeta(meta, "documentIdentifier", null));
                    docReq.setIssueDate(parseDate(getStringMeta(meta, "issueDate", null)));
                    docReq.setNotes(getStringMeta(meta, "notes", "Imported via SmartDrop"));
                    docReq.setFile(multipartFile);

                    Object created = vaultDocumentService.createDocument(userEmail, docReq);
                    response.setSuccess(true);
                    response.setMessage("Document added to Secure Vault → " + (section == VaultDocumentSection.EDUCATION ? "Education & Professional" : "Other Documents") + ".");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/vault");
                }
                case RESUME_BUILDER -> {
                    CreateResumeRequest resReq = new CreateResumeRequest();
                    resReq.setName(getStringMeta(meta, "name", getStringMeta(meta, "title", "Imported Resume")));
                    resReq.setTemplate(ResumeTemplate.MODERN);

                    ResumeContentDTO resumeData = request.getResumeData();
                    if (resumeData == null) {
                        resumeData = new ResumeContentDTO();
                    }
                    resReq.setContent(resumeData);

                    Object created = resumeService.createResume(userEmail, resReq);

                    // Optionally populate skills into profile
                    if (request.isPopulateProfileSkills() && resumeData.getSkills() != null) {
                        for (ResumeContentDTO.ResumeSkillDTO s : resumeData.getSkills()) {
                            try {
                                CreateSkillRequest skillReq = new CreateSkillRequest();
                                skillReq.setName(s.getName());
                                skillReq.setCategory(SkillCategory.PROGRAMMING_LANGUAGE);
                                skillReq.setProficiency(ProficiencyLevel.INTERMEDIATE);
                                skillService.createSkill(userEmail, skillReq);
                            } catch (Exception ignored) {}
                        }
                    }

                    response.setSuccess(true);
                    response.setMessage("Resume imported successfully into Resume Builder.");
                    response.setCreatedItem(created);
                    response.setNavigationUrl("/resume");
                }
                default -> throw new InvalidRequestException("Unsupported or unknown destination: " + dest);
            }

            // Cleanup temp file after successful routing
            storageService.removeTempFile(request.getTempFileId(), userEmail);

        } catch (Exception e) {
            log.error("Failed to route SmartDrop item to destination {}: {}", dest, e.getMessage());
            response.setSuccess(false);
            response.setMessage("Failed to save to " + dest + ": " + e.getMessage());
        }

        return response;
    }

    @Override
    public SmartDropBatchConfirmResponse confirmBatch(String userEmail, SmartDropBatchConfirmRequest batchRequest, String vaultToken) {
        if (batchRequest == null || batchRequest.getConfirmations() == null || batchRequest.getConfirmations().isEmpty()) {
            throw new InvalidRequestException("Batch confirmation list is empty.");
        }

        List<SmartDropConfirmResponse> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;

        for (SmartDropConfirmRequest req : batchRequest.getConfirmations()) {
            SmartDropConfirmResponse res = confirmAndRoute(userEmail, req, vaultToken);
            results.add(res);
            if (res.isSuccess()) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        return new SmartDropBatchConfirmResponse(batchRequest.getConfirmations().size(), successCount, failureCount, results);
    }

    @Override
    public void discardTempFile(String userEmail, String tempFileId) {
        storageService.removeTempFile(tempFileId, userEmail);
    }

    private String getStringMeta(Map<String, Object> meta, String key, String defaultVal) {
        if (meta != null && meta.get(key) != null) {
            String val = meta.get(key).toString().trim();
            if (!val.isEmpty()) return val;
        }
        return defaultVal;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return LocalDate.now();
        try {
            return LocalDate.parse(dateStr);
        } catch (Exception e) {
            return LocalDate.now();
        }
    }

    @SuppressWarnings("unchecked")
    private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value, E defaultVal) {
        if (value == null || value.isBlank()) return defaultVal;
        try {
            return Enum.valueOf(enumClass, value.trim().toUpperCase());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
