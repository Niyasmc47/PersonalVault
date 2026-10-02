package com.personalvault.service;

import com.personalvault.dto.CreateResumeRequest;
import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.dto.ResumeResponse;
import com.personalvault.dto.ResumeSummaryDTO;
import com.personalvault.dto.UpdateResumeRequest;

import java.util.List;

public interface ResumeService {

    ResumeResponse createResume(String userEmail, CreateResumeRequest request);

    List<ResumeSummaryDTO> getResumes(String userEmail);

    ResumeResponse getResumeById(String userEmail, Long id);

    ResumeResponse updateResume(String userEmail, Long id, UpdateResumeRequest request);

    void deleteResume(String userEmail, Long id);

    ResumeContentDTO getAutoBuildPreview(String userEmail);

    ResumeResponse rebuildResume(String userEmail, Long id);
}

