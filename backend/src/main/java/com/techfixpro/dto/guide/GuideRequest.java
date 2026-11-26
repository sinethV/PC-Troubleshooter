package com.techfixpro.dto.guide;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class GuideRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String symptoms;

    @NotBlank(message = "Target OS is required")
    private String targetOs = "Windows 11 / Windows 10";

    @Pattern(regexp = "BEGINNER|INTERMEDIATE|ADVANCED", message = "Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED")
    private String difficulty = "BEGINNER";

    private int estimatedTimeMinutes = 15;

    private List<GuideStepDto> steps = new ArrayList<>();

    public GuideRequest() {}

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getTargetOs() {
        return targetOs;
    }

    public void setTargetOs(String targetOs) {
        this.targetOs = targetOs;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public void setEstimatedTimeMinutes(int estimatedTimeMinutes) {
        this.estimatedTimeMinutes = estimatedTimeMinutes;
    }

    public List<GuideStepDto> getSteps() {
        return steps;
    }

    public void setSteps(List<GuideStepDto> steps) {
        this.steps = steps;
    }
}
