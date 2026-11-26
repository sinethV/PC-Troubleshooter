package com.techfixpro.controller;

import com.techfixpro.dto.assistant.AssistantAnswerDto;
import com.techfixpro.dto.common.ApiResponse;
import com.techfixpro.service.AssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assistant")
@Tag(name = "Assistant", description = "Knowledge-base assistant that matches a described problem to real commands and guides")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @GetMapping("/ask")
    @Operation(summary = "Ask a free-text IT problem and get ranked commands and guides with match reasons")
    public ResponseEntity<ApiResponse<AssistantAnswerDto>> ask(
            @Parameter(description = "Describe the symptom, e.g. 'wifi keeps disconnecting'")
            @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(assistantService.ask(q)));
    }
}
