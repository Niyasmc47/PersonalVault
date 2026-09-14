package com.personalvault.service.skill;

import com.personalvault.dto.skill.CreateSkillRequest;
import com.personalvault.dto.skill.ReorderSkillsRequest;
import com.personalvault.dto.skill.SkillResponse;
import com.personalvault.dto.skill.UpdateSkillRequest;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.Skill;
import com.personalvault.entity.skill.SkillCategory;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.skill.SkillMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.skill.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SkillMapper skillMapper;

    public SkillServiceImpl(SkillRepository skillRepository,
                            UserRepository userRepository,
                            SkillMapper skillMapper) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.skillMapper = skillMapper;
    }

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public SkillResponse createSkill(String userEmail, CreateSkillRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Skill skill = skillMapper.toEntity(request);
        skill.setUser(user);

        if (request.getDisplayOrder() == null || request.getDisplayOrder() == 0) {
            long count = skillRepository.countByUser(user);
            skill.setDisplayOrder((int) count);
        }

        Skill savedSkill = skillRepository.save(skill);
        return skillMapper.toResponse(savedSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getSkills(String userEmail,
                                         SkillCategory category,
                                         ProficiencyLevel proficiency,
                                         Boolean featured,
                                         Boolean includeInResume,
                                         String search) {
        User user = getAuthenticatedUser(userEmail);

        List<Skill> skills;
        if (search != null && !search.isBlank()) {
            skills = skillRepository.searchSkills(user, search.trim());
        } else if (category != null) {
            skills = skillRepository.findByUserAndCategoryOrderByDisplayOrderAscCreatedAtDesc(user, category);
        } else if (proficiency != null) {
            skills = skillRepository.findByUserAndProficiencyOrderByDisplayOrderAscCreatedAtDesc(user, proficiency);
        } else if (featured != null && featured) {
            skills = skillRepository.findByUserAndFeaturedTrueOrderByDisplayOrderAscCreatedAtDesc(user);
        } else if (includeInResume != null && includeInResume) {
            skills = skillRepository.findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtDesc(user);
        } else {
            skills = skillRepository.findByUserOrderByDisplayOrderAscCreatedAtDesc(user);
        }

        return skills.stream()
                .filter(s -> {
                    if (category != null && s.getCategory() != category) return false;
                    if (proficiency != null && s.getProficiency() != proficiency) return false;
                    if (featured != null && s.isFeatured() != featured) return false;
                    if (includeInResume != null && s.isIncludeInResume() != includeInResume) return false;
                    return true;
                })
                .map(skillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Skill skill = skillRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));
        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional
    public SkillResponse updateSkill(String userEmail, Long id, UpdateSkillRequest request) {
        User user = getAuthenticatedUser(userEmail);
        Skill skill = skillRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));

        skillMapper.updateEntityFromRequest(request, skill);
        Skill updated = skillRepository.save(skill);
        return skillMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSkill(String userEmail, Long id) {
        User user = getAuthenticatedUser(userEmail);
        Skill skill = skillRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));
        skillRepository.delete(skill);
    }

    @Override
    @Transactional
    public List<SkillResponse> reorderSkills(String userEmail, ReorderSkillsRequest request) {
        User user = getAuthenticatedUser(userEmail);
        List<Long> ids = request.getSkillIds();

        for (int i = 0; i < ids.size(); i++) {
            Long skillId = ids.get(i);
            int order = i;
            skillRepository.findByIdAndUser(skillId, user).ifPresent(skill -> {
                skill.setDisplayOrder(order);
                skillRepository.save(skill);
            });
        }

        List<Skill> updatedList = skillRepository.findByUserOrderByDisplayOrderAscCreatedAtDesc(user);
        return updatedList.stream().map(skillMapper::toResponse).collect(Collectors.toList());
    }
}

