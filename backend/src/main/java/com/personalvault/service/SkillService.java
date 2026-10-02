package com.personalvault.service;

import com.personalvault.dto.CreateSkillRequest;
import com.personalvault.dto.ReorderSkillsRequest;
import com.personalvault.dto.SkillResponse;
import com.personalvault.dto.UpdateSkillRequest;
import com.personalvault.entity.ProficiencyLevel;
import com.personalvault.entity.SkillCategory;

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

