package com.personalvault.service;

import com.personalvault.entity.Achievement;
import com.personalvault.entity.User;
import com.personalvault.entity.Certificate;
import com.personalvault.entity.Project;
import com.personalvault.entity.VaultDocument;
import com.personalvault.entity.VaultDocumentSection;
import com.personalvault.repository.AchievementRepository;
import com.personalvault.repository.CertificateRepository;
import com.personalvault.repository.ProjectRepository;
import com.personalvault.repository.VaultDocumentRepository;
import com.personalvault.model.ClassificationResult;
import com.personalvault.model.SmartDropDestination;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SmartDropDuplicateService {

    private final CertificateRepository certificateRepository;
    private final ProjectRepository projectRepository;
    private final AchievementRepository achievementRepository;
    private final VaultDocumentRepository vaultDocumentRepository;

    public SmartDropDuplicateService(CertificateRepository certificateRepository,
                                     ProjectRepository projectRepository,
                                     AchievementRepository achievementRepository,
                                     VaultDocumentRepository vaultDocumentRepository) {
        this.certificateRepository = certificateRepository;
        this.projectRepository = projectRepository;
        this.achievementRepository = achievementRepository;
        this.vaultDocumentRepository = vaultDocumentRepository;
    }

    public void checkAndFlagDuplicates(User user, ClassificationResult result) {
        if (result == null || result.getSuggestedDestination() == null) {
            return;
        }

        Map<String, Object> fields = result.getExtractedFields();
        if (fields == null) {
            return;
        }

        String title = fields.get("title") != null ? fields.get("title").toString().trim().toLowerCase() : "";
        if (title.isBlank()) {
            return;
        }

        SmartDropDestination destination = result.getSuggestedDestination();

        if (destination == SmartDropDestination.CERTIFICATES) {
            List<Certificate> certs = certificateRepository.findByUserOrderByIssueDateDesc(user);
            for (Certificate c : certs) {
                if (c.getTitle() != null && isSimilar(c.getTitle().toLowerCase(), title)) {
                    result.setDuplicate(true);
                    result.setDuplicateExistingId(c.getId());
                    result.setDuplicateMessage("A certificate with a similar title ('" + c.getTitle() + "') already exists in your Certificates.");
                    return;
                }
            }
        } else if (destination == SmartDropDestination.PROJECTS) {
            List<Project> projs = projectRepository.findByUserOrderByUpdatedAtDesc(user);
            for (Project p : projs) {
                if (p.getTitle() != null && isSimilar(p.getTitle().toLowerCase(), title)) {
                    result.setDuplicate(true);
                    result.setDuplicateExistingId(p.getId());
                    result.setDuplicateMessage("A project with a similar title ('" + p.getTitle() + "') already exists in your Projects portfolio.");
                    return;
                }
            }
        } else if (destination == SmartDropDestination.ACHIEVEMENTS) {
            List<Achievement> achs = achievementRepository.findByUserOrderByDisplayOrderAscAchievementDateDesc(user);
            for (Achievement a : achs) {
                if (a.getTitle() != null && isSimilar(a.getTitle().toLowerCase(), title)) {
                    result.setDuplicate(true);
                    result.setDuplicateExistingId(a.getId());
                    result.setDuplicateMessage("An achievement with a similar title ('" + a.getTitle() + "') already exists in your Achievements.");
                    return;
                }
            }
        } else if (destination == SmartDropDestination.SECURE_VAULT_EDUCATION || destination == SmartDropDestination.SECURE_VAULT_OTHER) {
            VaultDocumentSection section = destination == SmartDropDestination.SECURE_VAULT_EDUCATION ? VaultDocumentSection.EDUCATION : VaultDocumentSection.OTHER;
            List<VaultDocument> docs = vaultDocumentRepository.findByUserAndSectionOrderByCreatedAtDesc(user, section);
            for (VaultDocument d : docs) {
                if (d.getTitle() != null && isSimilar(d.getTitle().toLowerCase(), title)) {
                    result.setDuplicate(true);
                    result.setDuplicateExistingId(d.getId());
                    result.setDuplicateMessage("A vault document with a similar title ('" + d.getTitle() + "') already exists in your Secure Vault.");
                    return;
                }
            }
        }
    }

    private boolean isSimilar(String a, String b) {
        if (a.equals(b)) return true;
        if (a.contains(b) || b.contains(a)) return true;
        if (a.length() > 5 && b.length() > 5) {
            int distance = calculateLevenshtein(a, b);
            int maxLen = Math.max(a.length(), b.length());
            return (1.0 - (double) distance / maxLen) >= 0.80;
        }
        return false;
    }

    private int calculateLevenshtein(String s1, String s2) {
        int[] prev = new int[s2.length() + 1];
        for (int j = 0; j <= s2.length(); j++) prev[j] = j;

        for (int i = 1; i <= s1.length(); i++) {
            int[] curr = new int[s2.length() + 1];
            curr[0] = i;
            for (int j = 1; j <= s2.length(); j++) {
                int cost = s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1;
                curr[j] = Math.min(Math.min(curr[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            prev = curr;
        }
        return prev[s2.length()];
    }
}
