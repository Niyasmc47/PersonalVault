package com.personalvault.dto.resume;

import com.personalvault.entity.resume.ResumeTemplate;
import jakarta.validation.constraints.Size;

public class UpdateResumeRequest {

    @Size(max = 100, message = "Resume name must not exceed 100 characters")
    private String name;

    @Size(max = 100, message = "Target role must not exceed 100 characters")
    private String targetRole;

    private ResumeTemplate template;

    private ResumeContentDTO content;

    public UpdateResumeRequest() {
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
}
