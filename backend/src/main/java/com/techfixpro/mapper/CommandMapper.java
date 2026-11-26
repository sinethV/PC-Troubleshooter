package com.techfixpro.mapper;

import com.techfixpro.dto.command.CommandRequest;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import org.springframework.stereotype.Component;

@Component
public class CommandMapper {

    public CommandResponse toResponse(Command command) {
        if (command == null) return null;
        CommandResponse response = new CommandResponse();
        response.setId(command.getId());
        if (command.getCategory() != null) {
            response.setCategoryId(command.getCategory().getId());
            response.setCategoryName(command.getCategory().getName());
            response.setCategorySlug(command.getCategory().getSlug());
        }
        response.setName(command.getName());
        response.setCommandSyntax(command.getCommandSyntax());
        response.setExplanation(command.getExplanation());
        response.setPurpose(command.getPurpose());
        response.setWhenToUse(command.getWhenToUse());
        response.setRequiredPermissions(command.getRequiredPermissions());
        response.setRiskLevel(command.getRiskLevel());
        response.setExpectedOutput(command.getExpectedOutput());
        response.setVerificationInstructions(command.getVerificationInstructions());
        response.setFeatured(command.isFeatured());
        response.setCreatedAt(command.getCreatedAt());
        response.setUpdatedAt(command.getUpdatedAt());
        return response;
    }

    public Command toEntity(CommandRequest request, Category category) {
        if (request == null) return null;
        Command command = new Command();
        command.setCategory(category);
        command.setName(request.getName());
        command.setCommandSyntax(request.getCommandSyntax());
        command.setExplanation(request.getExplanation());
        command.setPurpose(request.getPurpose());
        command.setWhenToUse(request.getWhenToUse());
        command.setRequiredPermissions(request.getRequiredPermissions());
        command.setRiskLevel(request.getRiskLevel() != null ? request.getRiskLevel().toUpperCase() : "SAFE");
        command.setExpectedOutput(request.getExpectedOutput());
        command.setVerificationInstructions(request.getVerificationInstructions());
        command.setFeatured(request.isFeatured());
        return command;
    }

    public void updateEntity(Command command, CommandRequest request, Category category) {
        if (command == null || request == null) return;
        command.setCategory(category);
        command.setName(request.getName());
        command.setCommandSyntax(request.getCommandSyntax());
        command.setExplanation(request.getExplanation());
        command.setPurpose(request.getPurpose());
        command.setWhenToUse(request.getWhenToUse());
        command.setRequiredPermissions(request.getRequiredPermissions());
        command.setRiskLevel(request.getRiskLevel() != null ? request.getRiskLevel().toUpperCase() : "SAFE");
        command.setExpectedOutput(request.getExpectedOutput());
        command.setVerificationInstructions(request.getVerificationInstructions());
        command.setFeatured(request.isFeatured());
    }
}
