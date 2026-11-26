package com.techfixpro.dto.system;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Health report derived only from measured values. Nothing here is random:
 * every check maps to a real metric with an explicit threshold.
 */
public class HealthReportDto {

    private int overallScore;
    private String status;
    private OffsetDateTime capturedAt;
    private List<Check> checks = new ArrayList<>();

    public static class Check {
        private String key;
        private String label;
        private String status;   // OK, WARN, CRITICAL
        private String value;
        private String detail;

        public Check() {}

        public Check(String key, String label, String status, String value, String detail) {
            this.key = key;
            this.label = label;
            this.status = status;
            this.value = value;
            this.detail = detail;
        }

        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(OffsetDateTime capturedAt) { this.capturedAt = capturedAt; }
    public List<Check> getChecks() { return checks; }
    public void setChecks(List<Check> checks) { this.checks = checks; }
}
