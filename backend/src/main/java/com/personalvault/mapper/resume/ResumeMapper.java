package com.personalvault.mapper.resume;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personalvault.dto.resume.ResumeContentDTO;
import com.personalvault.dto.resume.ResumeResponse;
import com.personalvault.dto.resume.ResumeSummaryDTO;
import com.personalvault.entity.resume.Resume;
import org.springframework.stereotype.Component;

@Component
public class ResumeMapper {

    private final ObjectMapper objectMapper;

    public ResumeMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public ResumeMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    public ResumeContentDTO parseContentJson(String json) {
        if (json == null || json.isBlank()) {
            return new ResumeContentDTO();
        }
        try {
            return objectMapper.readValue(json, ResumeContentDTO.class);
        } catch (JsonProcessingException e) {
            return new ResumeContentDTO();
        }
    }

    public String toJson(ResumeContentDTO content) {
        if (content == null) {
            content = new ResumeContentDTO();
        }
        try {
            return objectMapper.writeValueAsString(content);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    public ResumeResponse toResponse(Resume resume) {
        if (resume == null) {
            return null;
        }

        ResumeResponse response = new ResumeResponse();
        response.setId(resume.getId());
        response.setName(resume.getName());
        response.setTargetRole(resume.getTargetRole());
        response.setTemplate(resume.getTemplate());
        response.setContent(parseContentJson(resume.getContentJson()));
        response.setCreatedAt(resume.getCreatedAt());
        response.setUpdatedAt(resume.getUpdatedAt());

        return response;
    }

    public ResumeSummaryDTO toSummaryDTO(Resume resume) {
        if (resume == null) {
            return null;
        }

        ResumeSummaryDTO dto = new ResumeSummaryDTO();
        dto.setId(resume.getId());
        dto.setName(resume.getName());
        dto.setTargetRole(resume.getTargetRole());
        dto.setTemplate(resume.getTemplate());
        dto.setCreatedAt(resume.getCreatedAt());
        dto.setUpdatedAt(resume.getUpdatedAt());

        return dto;
    }
}

