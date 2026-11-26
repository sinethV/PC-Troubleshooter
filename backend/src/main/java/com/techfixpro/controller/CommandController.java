package com.techfixpro.controller;

import com.techfixpro.dto.command.CommandRequest;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.dto.common.ApiResponse;
import com.techfixpro.dto.common.PageResponse;
import com.techfixpro.service.CommandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commands")
@Tag(name = "Commands", description = "IT Technician Command Library (CMD, PowerShell, Linux) with risk and verification guidance")
public class CommandController {

    private final CommandService commandService;

    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    @GetMapping
    @Operation(summary = "Search and filter commands with pagination")
    public ResponseEntity<ApiResponse<PageResponse<CommandResponse>>> searchCommands(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("DESC") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<CommandResponse> result = commandService.searchCommands(categoryId, riskLevel, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/category/{slug}")
    @Operation(summary = "Get all commands belonging to a specific category slug (e.g. 'windows', 'networking')")
    public ResponseEntity<ApiResponse<List<CommandResponse>>> getCommandsByCategorySlug(@PathVariable String slug) {
        List<CommandResponse> commands = commandService.getCommandsByCategorySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(commands));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get curated featured commands for quick technician triage")
    public ResponseEntity<ApiResponse<List<CommandResponse>>> getFeaturedCommands() {
        List<CommandResponse> commands = commandService.getFeaturedCommands();
        return ResponseEntity.ok(ApiResponse.success(commands));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recently added technician commands")
    public ResponseEntity<ApiResponse<List<CommandResponse>>> getRecentCommands() {
        List<CommandResponse> commands = commandService.getRecentCommands();
        return ResponseEntity.ok(ApiResponse.success(commands));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get command details by ID")
    public ResponseEntity<ApiResponse<CommandResponse>> getCommandById(@PathVariable Long id) {
        CommandResponse command = commandService.getCommandById(id);
        return ResponseEntity.ok(ApiResponse.success(command));
    }

    @PostMapping
    @Operation(summary = "Add a new technician command to library")
    public ResponseEntity<ApiResponse<CommandResponse>> createCommand(@Valid @RequestBody CommandRequest request) {
        CommandResponse created = commandService.createCommand(request);
        return new ResponseEntity<>(ApiResponse.success("Command created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing command")
    public ResponseEntity<ApiResponse<CommandResponse>> updateCommand(
            @PathVariable Long id, @Valid @RequestBody CommandRequest request) {
        CommandResponse updated = commandService.updateCommand(id, request);
        return ResponseEntity.ok(ApiResponse.success("Command updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete command by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCommand(@PathVariable Long id) {
        commandService.deleteCommand(id);
        return ResponseEntity.ok(ApiResponse.success("Command deleted successfully", null));
    }

    @PostMapping("/{id}/copy")
    @Operation(summary = "Record technician command copy/execution usage for audit trail")
    public ResponseEntity<ApiResponse<Void>> recordUsage(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Web Console Copy") String context) {
        commandService.recordCommandUsage(id, context);
        return ResponseEntity.ok(ApiResponse.success("Usage recorded", null));
    }
}
