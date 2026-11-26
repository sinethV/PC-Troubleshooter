package com.techfixpro.service;

import com.techfixpro.dto.system.HealthReportDto;
import com.techfixpro.dto.system.SystemInfoDto;
import com.techfixpro.service.impl.SystemInfoServiceImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SystemInfoServiceTest {

    private final SystemInfoService service = new SystemInfoServiceImpl();

    @Test
    void systemInfoContainsLiveMeasuredValues() {
        SystemInfoDto info = service.getSystemInfo();

        assertNotNull(info.getCapturedAt());
        assertNotNull(info.getHostname());
        assertFalse(info.getHostname().isBlank());

        assertNotNull(info.getOsName());
        assertNotNull(info.getJavaVersion());
        assertTrue(info.getUptimeSeconds() >= 0);

        assertTrue(info.getCpu().getLogicalProcessors() > 0);
        assertNotNull(info.getCpu().getModel());

        assertTrue(info.getMemory().getTotalBytes() > 0, "Total memory must be measurable");
        assertTrue(info.getMemory().getUsedBytes() >= 0);
        assertTrue(info.getMemory().getUsedPercent() >= 0 && info.getMemory().getUsedPercent() <= 100);

        assertTrue(info.getJvm().getHeapMaxBytes() > 0);

        assertFalse(info.getDisks().isEmpty(), "At least one volume should be readable");
        info.getDisks().forEach(disk -> {
            assertTrue(disk.getTotalBytes() > 0);
            assertTrue(disk.getUsedPercent() >= 0 && disk.getUsedPercent() <= 100);
        });

        assertNotNull(info.getNetwork(), "Network list should never be null");
    }

    @Test
    void healthReportScoreIsBoundedAndExplained() {
        HealthReportDto report = service.getHealthReport();

        assertTrue(report.getOverallScore() >= 0 && report.getOverallScore() <= 100);
        assertNotNull(report.getStatus());
        assertFalse(report.getChecks().isEmpty());

        report.getChecks().forEach(check -> {
            assertNotNull(check.getKey());
            assertNotNull(check.getLabel());
            assertNotNull(check.getStatus());
            assertNotNull(check.getValue());
            assertNotNull(check.getDetail());
        });
    }
}
