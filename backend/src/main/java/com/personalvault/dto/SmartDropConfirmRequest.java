package com.personalvault.dto;

import com.personalvault.dto.ResumeContentDTO;
import com.personalvault.model.SmartDropDestination;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public class SmartDropConfirmRequest {

    @NotBlank(message = "Temp file ID is required")
    private String tempFileId;

    @NotNull(message = "Destination is required")
    private SmartDropDestination destination;

    private Map<String, Object> metadata;

    private ResumeContentDTO resumeData;

    private boolean populateProfileSkills = true;
    private boolean populateProfileProjects = true;
    private boolean populateProfileAchievements = true;

    public SmartDropConfirmRequest() {}

    public String getTempFileId() {
        return tempFileId;
    }

    public void setTempFileId(String tempFileId) {
        this.tempFileId = tempFileId;
    }

    public SmartDropDestination getDestination() {
        return destination;
    }

    public void setDestination(SmartDropDestination destination) {
        this.destination = destination;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public ResumeContentDTO getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeContentDTO resumeData) {
        this.resumeData = resumeData;
    }

    public boolean isPopulateProfileSkills() {
        return populateProfileSkills;
    }

    public void setPopulateProfileSkills(boolean populateProfileSkills) {
        this.populateProfileSkills = populateProfileSkills;
    }

    public boolean isPopulateProfileProjects() {
        return populateProfileProjects;
    }

    public void setPopulateProfileProjects(boolean populateProfileProjects) {
        this.populateProfileProjects = populateProfileProjects;
    }

    public boolean isPopulateProfileAchievements() {
        return populateProfileAchievements;
    }

    public void setPopulateProfileAchievements(boolean populateProfileAchievements) {
        this.populateProfileAchievements = populateProfileAchievements;
    }
}
