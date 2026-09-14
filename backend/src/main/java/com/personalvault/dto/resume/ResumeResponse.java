package com.personalvault.dto.resume;

import com.personalvault.entity.resume.ResumeTemplate;
import java.time.LocalDateTime;

public class ResumeResponse {

    private Long id;
    private String name;
    private String targetRole;
    private ResumeTemplate template;
    private ResumeContentDTO content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ResumeResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public ResumeTemplate getTemplate() {
        return template;
    }

    public void setTemplate(ResumeTemplate template) {
        this.template = template;
    }

    public ResumeContentDTO getContent() {
        return content;
    }

    public void setContent(ResumeContentDTO content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
