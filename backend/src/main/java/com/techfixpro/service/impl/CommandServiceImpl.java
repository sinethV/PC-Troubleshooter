package com.techfixpro.service.impl;

import com.techfixpro.dto.command.CommandRequest;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.dto.common.PageResponse;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import com.techfixpro.entity.ToolUsage;
import com.techfixpro.exception.ResourceNotFoundException;
import com.techfixpro.mapper.CommandMapper;
import com.techfixpro.repository.CategoryRepository;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.ToolUsageRepository;
import com.techfixpro.service.CommandService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommandServiceImpl implements CommandService {

    private final CommandRepository commandRepository;
    private final CategoryRepository categoryRepository;
    private final ToolUsageRepository toolUsageRepository;
    private final CommandMapper commandMapper;

    public CommandServiceImpl(CommandRepository commandRepository,
                              CategoryRepository categoryRepository,
                              ToolUsageRepository toolUsageRepository,
                              CommandMapper commandMapper) {
        this.commandRepository = commandRepository;
        this.categoryRepository = categoryRepository;
        this.toolUsageRepository = toolUsageRepository;
        this.commandMapper = commandMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommandResponse> searchCommands(Long categoryId, String riskLevel, String query, Pageable pageable) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanRisk = (riskLevel != null && !riskLevel.trim().isEmpty() && !riskLevel.equalsIgnoreCase("ALL"))
                ? riskLevel.trim().toUpperCase() : null;

        Page<Command> page = commandRepository.searchCommands(categoryId, cleanRisk, cleanQuery, pageable);
        List<CommandResponse> content = page.getContent().stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommandResponse> getCommandsByCategorySlug(String slug) {
        return commandRepository.findByCategorySlug(slug).stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommandResponse> getFeaturedCommands() {
        return commandRepository.findByFeaturedTrue().stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommandResponse> getRecentCommands() {
        return commandRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CommandResponse getCommandById(Long id) {
        Command command = commandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Command", "id", id));
        return commandMapper.toResponse(command);
    }

    @Override
    public CommandResponse createCommand(CommandRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Command command = commandMapper.toEntity(request, category);
        Command saved = commandRepository.save(command);
        return commandMapper.toResponse(saved);
    }

    @Override
    public CommandResponse updateCommand(Long id, CommandRequest request) {
        Command command = commandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Command", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        commandMapper.updateEntity(command, request, category);
        Command updated = commandRepository.save(command);
        return commandMapper.toResponse(updated);
    }

    @Override
    public void deleteCommand(Long id) {
        if (!commandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Command", "id", id);
        }
        commandRepository.deleteById(id);
    }

    @Override
    public void recordCommandUsage(Long commandId, String context) {
        Command command = commandRepository.findById(commandId)
                .orElseThrow(() -> new ResourceNotFoundException("Command", "id", commandId));

        ToolUsage usage = new ToolUsage();
        usage.setCommand(command);
        usage.setToolName(command.getName());
        usage.setExecutionContext(context != null ? context : "Web Technician Toolkit");
        usage.setExecutedAt(OffsetDateTime.now());

        toolUsageRepository.save(usage);
    }
}
