package com.personalvault.dto.resume;

import com.personalvault.entity.resume.ResumeTemplate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateResumeRequest {

    @NotBlank(message = "Resume name is required")
    @Size(max = 100, message = "Resume name must not exceed 100 characters")
    private String name;

    @Size(max = 100, message = "Target role must not exceed 100 characters")
    private String targetRole;

    @NotNull(message = "Template is required")
    private ResumeTemplate template = ResumeTemplate.PROFESSIONAL;

    private ResumeContentDTO content;

    private boolean autoPopulate = true;

    public CreateResumeRequest() {
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

    public boolean isAutoPopulate() {
        return autoPopulate;
    }

    public void setAutoPopulate(boolean autoPopulate) {
        this.autoPopulate = autoPopulate;
    }
}
