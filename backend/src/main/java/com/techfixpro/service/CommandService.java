package com.techfixpro.service;

import com.techfixpro.dto.command.CommandRequest;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.dto.common.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommandService {
    PageResponse<CommandResponse> searchCommands(Long categoryId, String riskLevel, String query, Pageable pageable);
    List<CommandResponse> getCommandsByCategorySlug(String slug);
    List<CommandResponse> getFeaturedCommands();
    List<CommandResponse> getRecentCommands();
    CommandResponse getCommandById(Long id);
    CommandResponse createCommand(CommandRequest request);
    CommandResponse updateCommand(Long id, CommandRequest request);
    void deleteCommand(Long id);
    void recordCommandUsage(Long commandId, String context);
}
