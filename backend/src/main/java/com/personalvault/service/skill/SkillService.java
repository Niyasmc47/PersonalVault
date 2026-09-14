package com.personalvault.service.skill;

import com.personalvault.dto.skill.CreateSkillRequest;
import com.personalvault.dto.skill.ReorderSkillsRequest;
import com.personalvault.dto.skill.SkillResponse;
import com.personalvault.dto.skill.UpdateSkillRequest;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.SkillCategory;

import java.util.List;

public interface SkillService {

    SkillResponse createSkill(String userEmail, CreateSkillRequest request);

    List<SkillResponse> getSkills(String userEmail,
                                  SkillCategory category,
                                  ProficiencyLevel proficiency,
                                  Boolean featured,
                                  Boolean includeInResume,
                                  String search);

    SkillResponse getSkillById(String userEmail, Long id);

    SkillResponse updateSkill(String userEmail, Long id, UpdateSkillRequest request);

    void deleteSkill(String userEmail, Long id);

    List<SkillResponse> reorderSkills(String userEmail, ReorderSkillsRequest request);
}

