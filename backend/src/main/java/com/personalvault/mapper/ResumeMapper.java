package com.personalvault.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.dto.ResumeResponse;
import com.personalvault.dto.ResumeSummaryDTO;
import com.personalvault.entity.Resume;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ResumeMapper {

    private static final Logger log = LoggerFactory.getLogger(ResumeMapper.class);

    private final ObjectMapper objectMapper;

    @Autowired
    public ResumeMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ResumeContentDTO parseContentJson(String json) {
        if (json == null || json.isBlank()) {
            return new ResumeContentDTO();
        }
        try {
            return objectMapper.readValue(json, ResumeContentDTO.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse resume content JSON: {}", e.getMessage());
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
            log.error("Failed to serialize resume content to JSON: {}", e.getMessage());
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
