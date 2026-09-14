package com.personalvault.controller.skill;

import com.personalvault.dto.skill.CreateSkillRequest;
import com.personalvault.dto.skill.ReorderSkillsRequest;
import com.personalvault.dto.skill.SkillResponse;
import com.personalvault.dto.skill.UpdateSkillRequest;
import com.personalvault.entity.skill.ProficiencyLevel;
import com.personalvault.entity.skill.SkillCategory;
import com.personalvault.service.skill.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<SkillResponse> createSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateSkillRequest request) {
        SkillResponse response = skillService.createSkill(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getSkills(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) SkillCategory category,
            @RequestParam(required = false) ProficiencyLevel proficiency,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean includeInResume,
            @RequestParam(required = false) String search) {
        List<SkillResponse> responses = skillService.getSkills(
                userDetails.getUsername(),
                category,
                proficiency,
                featured,
                includeInResume,
                search
        );
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillResponse> getSkillById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        SkillResponse response = skillService.getSkillById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> updateSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateSkillRequest request) {
        SkillResponse response = skillService.updateSkill(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        skillService.deleteSkill(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<SkillResponse>> reorderSkills(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReorderSkillsRequest request) {
        List<SkillResponse> responses = skillService.reorderSkills(userDetails.getUsername(), request);
        return ResponseEntity.ok(responses);
    }
}

