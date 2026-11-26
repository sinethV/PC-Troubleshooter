package com.techfixpro.controller;

import com.techfixpro.dto.common.ApiResponse;
import com.techfixpro.dto.system.HealthReportDto;
import com.techfixpro.dto.system.SystemInfoDto;
import com.techfixpro.service.SystemInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/system")
@Tag(name = "System Diagnostics", description = "Live read-only information about the machine hosting the backend")
public class SystemController {

    private final SystemInfoService systemInfoService;

    public SystemController(SystemInfoService systemInfoService) {
        this.systemInfoService = systemInfoService;
    }

    @GetMapping("/info")
    @Operation(summary = "Get live host information: OS, CPU, memory, disks, network adapters and JVM")
    public ResponseEntity<ApiResponse<SystemInfoDto>> getSystemInfo() {
        return ResponseEntity.ok(ApiResponse.success(systemInfoService.getSystemInfo()));
    }

    @GetMapping("/health")
    @Operation(summary = "Get a health report computed from measured memory, CPU, storage, uptime and heap values")
    public ResponseEntity<ApiResponse<HealthReportDto>> getHealthReport() {
        return ResponseEntity.ok(ApiResponse.success(systemInfoService.getHealthReport()));
    }
}
