package com.personalvault.service.resume;

import com.personalvault.dto.resume.CreateResumeRequest;
import com.personalvault.dto.resume.ResumeContentDTO;
import com.personalvault.dto.resume.ResumeResponse;
import com.personalvault.dto.resume.ResumeSummaryDTO;
import com.personalvault.dto.resume.UpdateResumeRequest;

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

