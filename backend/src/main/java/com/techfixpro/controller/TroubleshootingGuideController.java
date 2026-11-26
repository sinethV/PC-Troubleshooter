package com.techfixpro.controller;

import com.techfixpro.dto.common.ApiResponse;
import com.techfixpro.dto.common.PageResponse;
import com.techfixpro.dto.guide.GuideRequest;
import com.techfixpro.dto.guide.GuideResponse;
import com.techfixpro.service.TroubleshootingGuideService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/guides")
@Tag(name = "Troubleshooting Guides", description = "Step-by-step diagnostic workflows for IT field problems")
public class TroubleshootingGuideController {

    private final TroubleshootingGuideService guideService;

    public TroubleshootingGuideController(TroubleshootingGuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    @Operation(summary = "Search and filter troubleshooting guides with pagination")
    public ResponseEntity<ApiResponse<PageResponse<GuideResponse>>> searchGuides(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<GuideResponse> result = guideService.searchGuides(categoryId, difficulty, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/category/{slug}")
    @Operation(summary = "Get guides by category slug")
    public ResponseEntity<ApiResponse<List<GuideResponse>>> getGuidesByCategorySlug(@PathVariable String slug) {
        List<GuideResponse> guides = guideService.getGuidesByCategorySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(guides));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent guides")
    public ResponseEntity<ApiResponse<List<GuideResponse>>> getRecentGuides() {
        List<GuideResponse> guides = guideService.getRecentGuides();
        return ResponseEntity.ok(ApiResponse.success(guides));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed guide including all ordered steps and attached commands")
    public ResponseEntity<ApiResponse<GuideResponse>> getGuideById(@PathVariable Long id) {
        GuideResponse guide = guideService.getGuideById(id);
        return ResponseEntity.ok(ApiResponse.success(guide));
    }

    @PostMapping
    @Operation(summary = "Create a new troubleshooting guide with steps")
    public ResponseEntity<ApiResponse<GuideResponse>> createGuide(@Valid @RequestBody GuideRequest request) {
        GuideResponse created = guideService.createGuide(request);
        return new ResponseEntity<>(ApiResponse.success("Guide created successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete guide by ID")
    public ResponseEntity<ApiResponse<Void>> deleteGuide(@PathVariable Long id) {
        guideService.deleteGuide(id);
        return ResponseEntity.ok(ApiResponse.success("Guide deleted successfully", null));
    }
}
