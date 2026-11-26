package com.techfixpro.mapper;

import com.techfixpro.dto.guide.GuideRequest;
import com.techfixpro.dto.guide.GuideResponse;
import com.techfixpro.dto.guide.GuideStepDto;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.GuideStep;
import com.techfixpro.entity.TroubleshootingGuide;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GuideMapper {

    public GuideResponse toResponse(TroubleshootingGuide guide) {
        if (guide == null) return null;
        GuideResponse response = new GuideResponse();
        response.setId(guide.getId());
        if (guide.getCategory() != null) {
            response.setCategoryId(guide.getCategory().getId());
            response.setCategoryName(guide.getCategory().getName());
            response.setCategorySlug(guide.getCategory().getSlug());
        }
        response.setTitle(guide.getTitle());
        response.setDescription(guide.getDescription());
        response.setSymptoms(guide.getSymptoms());
        response.setTargetOs(guide.getTargetOs());
        response.setDifficulty(guide.getDifficulty());
        response.setEstimatedTimeMinutes(guide.getEstimatedTimeMinutes());
        response.setCreatedAt(guide.getCreatedAt());
        response.setUpdatedAt(guide.getUpdatedAt());

        if (guide.getSteps() != null) {
            response.setSteps(guide.getSteps().stream()
                    .map(this::toStepDto)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    public GuideStepDto toStepDto(GuideStep step) {
        if (step == null) return null;
        GuideStepDto dto = new GuideStepDto();
        dto.setId(step.getId());
        dto.setStepNumber(step.getStepNumber());
        dto.setTitle(step.getTitle());
        dto.setInstruction(step.getInstruction());
        dto.setWarningNote(step.getWarningNote());
        dto.setExpectedResult(step.getExpectedResult());
        if (step.getCommand() != null) {
            dto.setCommandId(step.getCommand().getId());
            dto.setCommandSyntax(step.getCommand().getCommandSyntax());
            dto.setCommandName(step.getCommand().getName());
        }
        return dto;
    }

    public TroubleshootingGuide toEntity(GuideRequest request, Category category) {
        if (request == null) return null;
        TroubleshootingGuide guide = new TroubleshootingGuide();
        guide.setCategory(category);
        guide.setTitle(request.getTitle());
        guide.setDescription(request.getDescription());
        guide.setSymptoms(request.getSymptoms());
        guide.setTargetOs(request.getTargetOs());
        guide.setDifficulty(request.getDifficulty() != null ? request.getDifficulty().toUpperCase() : "BEGINNER");
        guide.setEstimatedTimeMinutes(request.getEstimatedTimeMinutes());
        return guide;
    }
}
