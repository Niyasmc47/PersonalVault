package com.personalvault.controller.achievement;

import com.personalvault.dto.achievement.AchievementResponse;
import com.personalvault.dto.achievement.CreateAchievementRequest;
import com.personalvault.dto.achievement.ReorderAchievementsRequest;
import com.personalvault.dto.achievement.UpdateAchievementRequest;
import com.personalvault.entity.achievement.AchievementCategory;
import com.personalvault.service.achievement.AchievementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @PostMapping
    public ResponseEntity<AchievementResponse> createAchievement(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateAchievementRequest request) {
        AchievementResponse response = achievementService.createAchievement(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAchievements(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) AchievementCategory category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean includeInResume,
            @RequestParam(required = false) String search) {
        List<AchievementResponse> responses = achievementService.getAchievements(
                userDetails.getUsername(),
                category,
                featured,
                includeInResume,
                search
        );
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchievementResponse> getAchievementById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        AchievementResponse response = achievementService.getAchievementById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementResponse> updateAchievement(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateAchievementRequest request) {
        AchievementResponse response = achievementService.updateAchievement(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        achievementService.deleteAchievement(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<AchievementResponse>> reorderAchievements(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReorderAchievementsRequest request) {
        List<AchievementResponse> responses = achievementService.reorderAchievements(userDetails.getUsername(), request);
        return ResponseEntity.ok(responses);
    }
}

