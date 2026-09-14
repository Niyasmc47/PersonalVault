package com.personalvault.controller.resume;

import com.personalvault.dto.resume.CreateResumeRequest;
import com.personalvault.dto.resume.ResumeContentDTO;
import com.personalvault.dto.resume.ResumeResponse;
import com.personalvault.dto.resume.ResumeSummaryDTO;
import com.personalvault.dto.resume.UpdateResumeRequest;
import com.personalvault.service.resume.ResumeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateResumeRequest request) {
        ResumeResponse response = resumeService.createResume(userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResumeSummaryDTO>> getResumes(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ResumeSummaryDTO> responses = resumeService.getResumes(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        ResumeResponse response = resumeService.getResumeById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> updateResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateResumeRequest request) {
        ResumeResponse response = resumeService.updateResume(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        resumeService.deleteResume(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/auto-build-preview")
    public ResponseEntity<ResumeContentDTO> getAutoBuildPreview(
            @AuthenticationPrincipal UserDetails userDetails) {
        ResumeContentDTO content = resumeService.getAutoBuildPreview(userDetails.getUsername());
        return ResponseEntity.ok(content);
    }

    @PostMapping("/{id}/auto-build")
    public ResponseEntity<ResumeResponse> rebuildResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        ResumeResponse response = resumeService.rebuildResume(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }
}

