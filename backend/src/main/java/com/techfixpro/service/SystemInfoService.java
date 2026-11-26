package com.techfixpro.service;

import com.techfixpro.dto.system.HealthReportDto;
import com.techfixpro.dto.system.SystemInfoDto;

public interface SystemInfoService {

    SystemInfoDto getSystemInfo();

    HealthReportDto getHealthReport();
}
