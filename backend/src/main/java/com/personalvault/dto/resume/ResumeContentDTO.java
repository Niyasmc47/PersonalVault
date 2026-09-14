package com.personalvault.dto.resume;

import com.personalvault.entity.achievement.AchievementCategory;
import com.personalvault.entity.project.ProjectCategory;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.SkillCategory;
import com.personalvault.entity.social.SocialPlatform;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResumeContentDTO {

    private PersonalInfoDTO personalInfo = new PersonalInfoDTO();
    private List<ResumeSocialLinkDTO> socialLinks = new ArrayList<>();
    private List<ResumeSkillDTO> skills = new ArrayList<>();
    private List<ResumeExperienceDTO> experience = new ArrayList<>();
    private List<ResumeEducationDTO> education = new ArrayList<>();
    private List<ResumeProjectDTO> projects = new ArrayList<>();
    private List<ResumeCertificateDTO> certificates = new ArrayList<>();
    private List<ResumeAchievementDTO> achievements = new ArrayList<>();
    private List<String> sectionOrder = new ArrayList<>();
    private Map<String, String> sectionTitles = new HashMap<>();
    private Map<String, Boolean> sectionVisibility = new HashMap<>();
    private ResumeFormattingDTO formatting = new ResumeFormattingDTO();

    public ResumeContentDTO() {
    }

    // --- Inner DTOs ---

    public static class PersonalInfoDTO {
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String headline;
        private String summary;
        private String website;

        public PersonalInfoDTO() {}

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getHeadline() { return headline; }
        public void setHeadline(String headline) { this.headline = headline; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
    }

    public static class ResumeSocialLinkDTO {
        private Long id;
        private SocialPlatform platform;
        private String label;
        private String url;
        private String username;
        private boolean enabled = true;

        public ResumeSocialLinkDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public SocialPlatform getPlatform() { return platform; }
        public void setPlatform(SocialPlatform platform) { this.platform = platform; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeSkillDTO {
        private Long id;
        private String name;
        private SkillCategory category;
        private ProficiencyLevel proficiency;
        private Double yearsOfExperience;
        private boolean enabled = true;

        public ResumeSkillDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public SkillCategory getCategory() { return category; }
        public void setCategory(SkillCategory category) { this.category = category; }

        public ProficiencyLevel getProficiency() { return proficiency; }
        public void setProficiency(ProficiencyLevel proficiency) { this.proficiency = proficiency; }

        public Double getYearsOfExperience() { return yearsOfExperience; }
        public void setYearsOfExperience(Double yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeExperienceDTO {
        private String id;
        private String company;
        private String role;
        private String location;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean current = false;
        private String description;
        private List<String> highlights = new ArrayList<>();
        private boolean enabled = true;

        public ResumeExperienceDTO() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

        public boolean isCurrent() { return current; }
        public void setCurrent(boolean current) { this.current = current; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public List<String> getHighlights() { return highlights; }
        public void setHighlights(List<String> highlights) { this.highlights = highlights; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeEducationDTO {
        private String id;
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean current = false;
        private String grade;
        private String description;
        private boolean enabled = true;

        public ResumeEducationDTO() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }

        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }

        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

        public boolean isCurrent() { return current; }
        public void setCurrent(boolean current) { this.current = current; }

        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeProjectDTO {
        private Long id;
        private String title;
        private String description;
        private ProjectCategory category;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<String> technologies = new ArrayList<>();
        private String liveUrl;
        private String githubUrl;
        private String demoUrl;
        private List<String> highlights = new ArrayList<>();
        private boolean enabled = true;

        public ResumeProjectDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public ProjectCategory getCategory() { return category; }
        public void setCategory(ProjectCategory category) { this.category = category; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

        public List<String> getTechnologies() { return technologies; }
        public void setTechnologies(List<String> technologies) { this.technologies = technologies; }

        public String getLiveUrl() { return liveUrl; }
        public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

        public String getDemoUrl() { return demoUrl; }
        public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

        public List<String> getHighlights() { return highlights; }
        public void setHighlights(List<String> highlights) { this.highlights = highlights; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeCertificateDTO {
        private Long id;
        private String title;
        private String issuer;
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private String credentialUrl;
        private String credentialId;
        private boolean enabled = true;

        public ResumeCertificateDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }

        public LocalDate getIssueDate() { return issueDate; }
        public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public String getCredentialUrl() { return credentialUrl; }
        public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }

        public String getCredentialId() { return credentialId; }
        public void setCredentialId(String credentialId) { this.credentialId = credentialId; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeAchievementDTO {
        private Long id;
        private String title;
        private String organization;
        private LocalDate achievementDate;
        private String description;
        private AchievementCategory category;
        private String url;
        private boolean enabled = true;

        public ResumeAchievementDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getOrganization() { return organization; }
        public void setOrganization(String organization) { this.organization = organization; }

        public LocalDate getAchievementDate() { return achievementDate; }
        public void setAchievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public AchievementCategory getCategory() { return category; }
        public void setCategory(AchievementCategory category) { this.category = category; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    public static class ResumeFormattingDTO {
        private String fontFamily = "Inter";
        private String fontSize = "medium";
        private String primaryColor = "#000000";
        private String spacing = "comfortable";

        public ResumeFormattingDTO() {}

        public String getFontFamily() { return fontFamily; }
        public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }

        public String getFontSize() { return fontSize; }
        public void setFontSize(String fontSize) { this.fontSize = fontSize; }

        public String getPrimaryColor() { return primaryColor; }
        public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

        public String getSpacing() { return spacing; }
        public void setSpacing(String spacing) { this.spacing = spacing; }
    }

    // --- Root Getters & Setters ---

    public PersonalInfoDTO getPersonalInfo() { return personalInfo; }
    public void setPersonalInfo(PersonalInfoDTO personalInfo) { this.personalInfo = personalInfo; }

    public List<ResumeSocialLinkDTO> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(List<ResumeSocialLinkDTO> socialLinks) { this.socialLinks = socialLinks; }

    public List<ResumeSkillDTO> getSkills() { return skills; }
    public void setSkills(List<ResumeSkillDTO> skills) { this.skills = skills; }

    public List<ResumeExperienceDTO> getExperience() { return experience; }
    public void setExperience(List<ResumeExperienceDTO> experience) { this.experience = experience; }

    public List<ResumeEducationDTO> getEducation() { return education; }
    public void setEducation(List<ResumeEducationDTO> education) { this.education = education; }

    public List<ResumeProjectDTO> getProjects() { return projects; }
    public void setProjects(List<ResumeProjectDTO> projects) { this.projects = projects; }

    public List<ResumeCertificateDTO> getCertificates() { return certificates; }
    public void setCertificates(List<ResumeCertificateDTO> certificates) { this.certificates = certificates; }

    public List<ResumeAchievementDTO> getAchievements() { return achievements; }
    public void setAchievements(List<ResumeAchievementDTO> achievements) { this.achievements = achievements; }

    public List<String> getSectionOrder() { return sectionOrder; }
    public void setSectionOrder(List<String> sectionOrder) { this.sectionOrder = sectionOrder; }

    public Map<String, String> getSectionTitles() { return sectionTitles; }
    public void setSectionTitles(Map<String, String> sectionTitles) { this.sectionTitles = sectionTitles; }

    public Map<String, Boolean> getSectionVisibility() { return sectionVisibility; }
    public void setSectionVisibility(Map<String, Boolean> sectionVisibility) { this.sectionVisibility = sectionVisibility; }

    public ResumeFormattingDTO getFormatting() { return formatting; }
    public void setFormatting(ResumeFormattingDTO formatting) { this.formatting = formatting; }
}
