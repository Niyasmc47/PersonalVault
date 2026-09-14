package com.personalvault.service.resume;

import com.personalvault.dto.resume.*;
import com.personalvault.entity.achievement.Achievement;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.certificate.Certificate;
import com.personalvault.entity.project.Project;
import com.personalvault.entity.resume.Resume;
import com.personalvault.entity.resume.ResumeTemplate;
import com.personalvault.entity.skill.Skill;
import com.personalvault.entity.social.SocialLink;
import com.personalvault.entity.vault.VaultDocument;
import com.personalvault.entity.vault.VaultDocumentSection;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.resume.ResumeMapper;
import com.personalvault.repository.achievement.AchievementRepository;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.certificate.CertificateRepository;
import com.personalvault.repository.project.ProjectRepository;
import com.personalvault.repository.resume.ResumeRepository;
import com.personalvault.repository.skill.SkillRepository;
import com.personalvault.repository.social.SocialLinkRepository;
import com.personalvault.repository.vault.VaultDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;
    private final AchievementRepository achievementRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final VaultDocumentRepository vaultDocumentRepository;
    private final ResumeMapper resumeMapper;

    public ResumeServiceImpl(ResumeRepository resumeRepository,
                             UserRepository userRepository,
                             SkillRepository skillRepository,
                             ProjectRepository projectRepository,
                             CertificateRepository certificateRepository,
                             AchievementRepository achievementRepository,
                             SocialLinkRepository socialLinkRepository,
                             VaultDocumentRepository vaultDocumentRepository,
                             ResumeMapper resumeMapper) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.certificateRepository = certificateRepository;
        this.achievementRepository = achievementRepository;
        this.socialLinkRepository = socialLinkRepository;
        this.vaultDocumentRepository = vaultDocumentRepository;
        this.resumeMapper = resumeMapper;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public ResumeResponse createResume(String userEmail, CreateResumeRequest request) {
        User user = getAuthenticatedUser(userEmail);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setName(request.getName().trim());
        resume.setTargetRole(request.getTargetRole() != null ? request.getTargetRole().trim() : null);
        resume.setTemplate(request.getTemplate() != null ? request.getTemplate() : ResumeTemplate.PROFESSIONAL);

        ResumeContentDTO content;
        if (request.isAutoPopulate() || request.getContent() == null) {
            content = buildAutoResumeContent(user, request.getTargetRole());
            if (request.getContent() != null) {
                // Merge any specific personal info or edits if provided
                if (request.getContent().getPersonalInfo() != null && request.getContent().getPersonalInfo().getSummary() != null) {
                    content.getPersonalInfo().setSummary(request.getContent().getPersonalInfo().getSummary());
                }
            }
        } else {
            content = request.getContent();
        }

        resume.setContentJson(resumeMapper.toJson(content));
        Resume saved = resumeRepository.save(resume);
        return resumeMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeSummaryDTO> getResumes(String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        return resumeRepository.findByUserOrderByUpdatedAtDesc(user)
                .stream()
                .map(resumeMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeResponse getResumeById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));
        return resumeMapper.toResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(String userEmail, Long id, UpdateResumeRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            resume.setName(request.getName().trim());
        }
        if (request.getTargetRole() != null) {
            resume.setTargetRole(!request.getTargetRole().isBlank() ? request.getTargetRole().trim() : null);
        }
        if (request.getTemplate() != null) {
            resume.setTemplate(request.getTemplate());
        }
        if (request.getContent() != null) {
            resume.setContentJson(resumeMapper.toJson(request.getContent()));
        }

        Resume updated = resumeRepository.save(resume);
        return resumeMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteResume(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));
        resumeRepository.delete(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeContentDTO getAutoBuildPreview(String userEmail) {
        User user = getAuthenticatedUser(userEmail);
        return buildAutoResumeContent(user, null);
    }

    @Override
    @Transactional
    public ResumeResponse rebuildResume(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));

        ResumeContentDTO freshContent = buildAutoResumeContent(user, resume.getTargetRole());
        resume.setContentJson(resumeMapper.toJson(freshContent));
        Resume updated = resumeRepository.save(resume);
        return resumeMapper.toResponse(updated);
    }

    private ResumeContentDTO buildAutoResumeContent(User user, String targetRole) {
        ResumeContentDTO content = new ResumeContentDTO();

        // 1. Personal Info
        ResumeContentDTO.PersonalInfoDTO personalInfo = new ResumeContentDTO.PersonalInfoDTO();
        personalInfo.setFullName(user.getName() != null ? user.getName() : "");
        personalInfo.setEmail(user.getEmail() != null ? user.getEmail() : "");
        personalInfo.setHeadline(targetRole != null && !targetRole.isBlank() ? targetRole : "Software Engineer");
        personalInfo.setSummary("Passionate and results-driven professional dedicated to building scalable, resilient software solutions and solving complex engineering challenges.");
        personalInfo.setLocation("");
        personalInfo.setPhone("");
        personalInfo.setWebsite("");
        content.setPersonalInfo(personalInfo);

        // 2. Social Links
        List<SocialLink> socialLinks = socialLinkRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtAsc(user);
        if (socialLinks.isEmpty()) {
            socialLinks = socialLinkRepository.findByUserOrderByDisplayOrderAscCreatedAtAsc(user);
        }
        List<ResumeContentDTO.ResumeSocialLinkDTO> resumeSocials = socialLinks.stream().map(s -> {
            ResumeContentDTO.ResumeSocialLinkDTO dto = new ResumeContentDTO.ResumeSocialLinkDTO();
            dto.setId(s.getId());
            dto.setPlatform(s.getPlatform());
            dto.setLabel(s.getLabel());
            dto.setUrl(s.getUrl());
            dto.setUsername(s.getUsername());
            dto.setEnabled(true);
            return dto;
        }).collect(Collectors.toList());
        content.setSocialLinks(resumeSocials);

        // 3. Skills
        List<Skill> skills = skillRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtDesc(user);
        if (skills.isEmpty()) {
            skills = skillRepository.findByUserOrderByDisplayOrderAscCreatedAtDesc(user);
        }
        List<ResumeContentDTO.ResumeSkillDTO> resumeSkills = skills.stream().map(sk -> {
            ResumeContentDTO.ResumeSkillDTO dto = new ResumeContentDTO.ResumeSkillDTO();
            dto.setId(sk.getId());
            dto.setName(sk.getName());
            dto.setCategory(sk.getCategory());
            dto.setProficiency(sk.getProficiency());
            dto.setYearsOfExperience(sk.getYearsOfExperience());
            dto.setEnabled(true);
            return dto;
        }).collect(Collectors.toList());
        content.setSkills(resumeSkills);

        // 4. Projects
        List<Project> projects = projectRepository.findByUserOrderByUpdatedAtDesc(user);
        List<ResumeContentDTO.ResumeProjectDTO> resumeProjects = projects.stream().map(p -> {
            ResumeContentDTO.ResumeProjectDTO dto = new ResumeContentDTO.ResumeProjectDTO();
            dto.setId(p.getId());
            dto.setTitle(p.getTitle());
            dto.setDescription(p.getDescription());
            dto.setCategory(p.getCategory());
            dto.setStartDate(p.getStartDate());
            dto.setEndDate(p.getEndDate());
            dto.setTechnologies(p.getTechnologies() != null ? new ArrayList<>(p.getTechnologies()) : new ArrayList<>());
            dto.setLiveUrl(p.getLiveUrl());
            dto.setGithubUrl(p.getGithubUrl());
            dto.setDemoUrl(p.getDemoUrl());
            dto.setEnabled(true);
            return dto;
        }).collect(Collectors.toList());
        content.setProjects(resumeProjects);

        // 5. Certificates
        List<Certificate> certificates = certificateRepository.findByUserOrderByIssueDateDesc(user);
        List<ResumeContentDTO.ResumeCertificateDTO> resumeCerts = certificates.stream().map(c -> {
            ResumeContentDTO.ResumeCertificateDTO dto = new ResumeContentDTO.ResumeCertificateDTO();
            dto.setId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setIssuer(c.getIssuer());
            dto.setIssueDate(c.getIssueDate());
            dto.setExpiryDate(c.getExpiryDate());
            dto.setCredentialUrl(c.getCredentialUrl());
            dto.setCredentialId(c.getCredentialId());
            dto.setEnabled(true);
            return dto;
        }).collect(Collectors.toList());
        content.setCertificates(resumeCerts);

        // 6. Achievements
        List<Achievement> achievements = achievementRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscAchievementDateDesc(user);
        if (achievements.isEmpty()) {
            achievements = achievementRepository.findByUserOrderByDisplayOrderAscAchievementDateDesc(user);
        }
        List<ResumeContentDTO.ResumeAchievementDTO> resumeAchievements = achievements.stream().map(a -> {
            ResumeContentDTO.ResumeAchievementDTO dto = new ResumeContentDTO.ResumeAchievementDTO();
            dto.setId(a.getId());
            dto.setTitle(a.getTitle());
            dto.setOrganization(a.getOrganization());
            dto.setAchievementDate(a.getAchievementDate());
            dto.setDescription(a.getDescription());
            dto.setCategory(a.getCategory());
            dto.setUrl(a.getUrl());
            dto.setEnabled(true);
            return dto;
        }).collect(Collectors.toList());
        content.setAchievements(resumeAchievements);

        // 7. Education (extract from vault documents if present, else empty ready for user input)
        List<VaultDocument> educationDocs = vaultDocumentRepository.findByUserAndSectionOrderByCreatedAtDesc(user, VaultDocumentSection.EDUCATION);
        List<ResumeContentDTO.ResumeEducationDTO> resumeEducation = new ArrayList<>();
        if (!educationDocs.isEmpty()) {
            for (VaultDocument doc : educationDocs) {
                ResumeContentDTO.ResumeEducationDTO edu = new ResumeContentDTO.ResumeEducationDTO();
                edu.setId(UUID.randomUUID().toString());
                edu.setInstitution(doc.getIssuerOrInstitution() != null ? doc.getIssuerOrInstitution() : doc.getTitle());
                edu.setDegree(doc.getDocumentIdentifier() != null ? doc.getDocumentIdentifier() : "Degree / Qualification");
                edu.setStartDate(doc.getIssueDate());
                edu.setEndDate(doc.getExpiryDate());
                edu.setEnabled(true);
                resumeEducation.add(edu);
            }
        }
        content.setEducation(resumeEducation);

        // 8. Experience (empty list ready for user additions)
        content.setExperience(new ArrayList<>());

        // 9. Default Section Order & Titles
        content.setSectionOrder(Arrays.asList(
                "summary",
                "skills",
                "experience",
                "projects",
                "education",
                "achievements",
                "certificates"
        ));

        Map<String, String> titles = new HashMap<>();
        titles.put("summary", "Summary");
        titles.put("skills", "Technical & Professional Skills");
        titles.put("experience", "Work Experience");
        titles.put("projects", "Projects");
        titles.put("education", "Education");
        titles.put("achievements", "Achievements & Awards");
        titles.put("certificates", "Certifications & Credentials");
        content.setSectionTitles(titles);

        Map<String, Boolean> visibility = new HashMap<>();
        visibility.put("summary", true);
        visibility.put("skills", true);
        visibility.put("experience", true);
        visibility.put("projects", true);
        visibility.put("education", true);
        visibility.put("achievements", true);
        visibility.put("certificates", true);
        content.setSectionVisibility(visibility);

        content.setFormatting(new ResumeContentDTO.ResumeFormattingDTO());

        return content;
    }
}
