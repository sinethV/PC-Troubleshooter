package com.techfixpro.service.impl;

import com.sun.management.OperatingSystemMXBean;
import com.techfixpro.dto.system.HealthReportDto;
import com.techfixpro.dto.system.SystemInfoDto;
import com.techfixpro.service.SystemInfoService;
import org.springframework.stereotype.Service;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;

/**
 * Reads live host metrics through the JDK. Read-only: no shell commands,
 * no elevated privileges, no writes.
 */
@Service
public class SystemInfoServiceImpl implements SystemInfoService {

    @Override
    public SystemInfoDto getSystemInfo() {
        SystemInfoDto dto = new SystemInfoDto();
        dto.setCapturedAt(OffsetDateTime.now());

        java.lang.management.OperatingSystemMXBean baseOs = ManagementFactory.getOperatingSystemMXBean();
        OperatingSystemMXBean os = (baseOs instanceof OperatingSystemMXBean) ? (OperatingSystemMXBean) baseOs : null;

        dto.setHostname(safeHostname());
        dto.setOsName(baseOs.getName());
        dto.setOsVersion(baseOs.getVersion());
        dto.setOsArch(baseOs.getArch());
        dto.setJavaVersion(System.getProperty("java.version"));
        dto.setJavaVendor(System.getProperty("java.vendor"));

        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        dto.setUptimeSeconds(uptimeMillis / 1000L);
        dto.setBootTime(OffsetDateTime.ofInstant(
                java.time.Instant.ofEpochMilli(ManagementFactory.getRuntimeMXBean().getStartTime()),
                java.time.ZoneId.systemDefault()));

        // ---- CPU ----
        SystemInfoDto.CpuInfo cpu = new SystemInfoDto.CpuInfo();
        cpu.setModel(cpuModel(baseOs.getArch()));
        cpu.setLogicalProcessors(baseOs.getAvailableProcessors());
        if (os != null) {
            double load = os.getCpuLoad();
            cpu.setLoadPercent(load >= 0 ? round(load * 100.0) : -1);
            double processLoad = os.getProcessCpuLoad();
            cpu.setProcessLoadPercent(processLoad >= 0 ? round(processLoad * 100.0) : -1);
        }
        dto.setCpu(cpu);

        // ---- Memory ----
        SystemInfoDto.MemoryInfo mem = new SystemInfoDto.MemoryInfo();
        if (os != null) {
            long total = os.getTotalMemorySize();
            long free = os.getFreeMemorySize();
            long used = Math.max(0, total - free);
            mem.setTotalBytes(total);
            mem.setFreeBytes(free);
            mem.setUsedBytes(used);
            mem.setUsedPercent(total > 0 ? round(used * 100.0 / total) : 0);
        }
        dto.setMemory(mem);

        // ---- JVM heap ----
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heap = memoryBean.getHeapMemoryUsage();
        SystemInfoDto.JvmInfo jvm = new SystemInfoDto.JvmInfo();
        jvm.setHeapUsedBytes(heap.getUsed());
        jvm.setHeapMaxBytes(heap.getMax() > 0 ? heap.getMax() : heap.getCommitted());
        if (jvm.getHeapMaxBytes() > 0) {
            jvm.setHeapUsedPercent(round(heap.getUsed() * 100.0 / jvm.getHeapMaxBytes()));
        }
        dto.setJvm(jvm);

        // ---- Disks ----
        dto.setDisks(readDisks());

        // ---- Network ----
        dto.setNetwork(readNetwork());

        // ---- Processes ----
        try {
            dto.setProcessCount(ProcessHandle.allProcesses().count());
        } catch (RuntimeException ex) {
            dto.setProcessCount(-1);
        }

        return dto;
    }

    @Override
    public HealthReportDto getHealthReport() {
        SystemInfoDto info = getSystemInfo();
        HealthReportDto report = new HealthReportDto();
        report.setCapturedAt(info.getCapturedAt());

        List<HealthReportDto.Check> checks = new ArrayList<>();
        List<Integer> scores = new ArrayList<>();

        // Memory
        double memUsed = info.getMemory().getUsedPercent();
        int memScore = scoreFromUsage(memUsed, 70, 85, 95);
        scores.add(memScore);
        checks.add(new HealthReportDto.Check(
                "memory", "Memory pressure", statusFromScore(memScore),
                String.format(Locale.ROOT, "%.1f%% used", memUsed),
                formatBytes(info.getMemory().getUsedBytes()) + " of "
                        + formatBytes(info.getMemory().getTotalBytes()) + " in use"));

        // CPU (may be unavailable on some JVMs)
        double cpuLoad = info.getCpu().getLoadPercent();
        if (cpuLoad >= 0) {
            int cpuScore = scoreFromUsage(cpuLoad, 50, 75, 90);
            scores.add(cpuScore);
            checks.add(new HealthReportDto.Check(
                    "cpu", "CPU load", statusFromScore(cpuScore),
                    String.format(Locale.ROOT, "%.1f%%", cpuLoad),
                    info.getCpu().getLogicalProcessors() + " logical processors"));
        } else {
            checks.add(new HealthReportDto.Check(
                    "cpu", "CPU load", "UNKNOWN", "n/a",
                    "CPU load is not exposed by this operating system"));
        }

        // Storage (worst volume)
        SystemInfoDto.DiskInfo worst = null;
        for (SystemInfoDto.DiskInfo disk : info.getDisks()) {
            if (disk.getTotalBytes() <= 0) continue;
            if (worst == null || disk.getUsedPercent() > worst.getUsedPercent()) {
                worst = disk;
            }
        }
        if (worst != null) {
            int diskScore = scoreFromUsage(worst.getUsedPercent(), 75, 88, 95);
            scores.add(diskScore);
            checks.add(new HealthReportDto.Check(
                    "storage", "Storage capacity", statusFromScore(diskScore),
                    String.format(Locale.ROOT, "%.1f%% on %s", worst.getUsedPercent(), worst.getName()),
                    formatBytes(worst.getUsableBytes()) + " free of " + formatBytes(worst.getTotalBytes())));
        }

        // Backend uptime (the JVM process, not the operating system)
        long days = info.getUptimeSeconds() / 86_400L;
        if (days >= 30) {
            scores.add(60);
            checks.add(new HealthReportDto.Check(
                    "uptime", "Backend uptime", "WARN", days + " days",
                    "The backend has run for a long time; restart it to rule out a memory leak"));
        } else {
            scores.add(100);
            checks.add(new HealthReportDto.Check(
                    "uptime", "Backend uptime", "OK", humanUptime(info.getUptimeSeconds()),
                    "Service started " + info.getBootTime().toLocalDate()));
        }

        // JVM heap
        double heapUsed = info.getJvm().getHeapUsedPercent();
        int heapScore = scoreFromUsage(heapUsed, 70, 85, 95);
        scores.add(heapScore);
        checks.add(new HealthReportDto.Check(
                "heap", "Backend heap", statusFromScore(heapScore),
                String.format(Locale.ROOT, "%.1f%%", heapUsed),
                formatBytes(info.getJvm().getHeapUsedBytes()) + " of "
                        + formatBytes(info.getJvm().getHeapMaxBytes())));

        int total = 0;
        for (int score : scores) total += score;
        int overall = scores.isEmpty() ? 0 : Math.round((float) total / scores.size());

        report.setOverallScore(overall);
        report.setStatus(overallStatus(overall));
        report.setChecks(checks);
        return report;
    }

    private List<SystemInfoDto.DiskInfo> readDisks() {
        List<SystemInfoDto.DiskInfo> disks = new ArrayList<>();
        File[] roots = File.listRoots();
        if (roots == null) return disks;

        for (File root : roots) {
            try {
                long total = root.getTotalSpace();
                if (total <= 0) continue;

                long usable = root.getUsableSpace();
                long free = root.getFreeSpace();

                SystemInfoDto.DiskInfo disk = new SystemInfoDto.DiskInfo();
                disk.setName(root.getPath());
                disk.setType("Local");
                disk.setTotalBytes(total);
                disk.setFreeBytes(free);
                disk.setUsableBytes(usable);
                disk.setUsedPercent(round((total - usable) * 100.0 / total));
                disks.add(disk);
            } catch (SecurityException ignored) {
                // Volume not readable by this account: skip it instead of failing the whole report.
            }
        }
        return disks;
    }

    private List<SystemInfoDto.NetworkAdapter> readNetwork() {
        List<SystemInfoDto.NetworkAdapter> adapters = new ArrayList<>();
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            if (interfaces == null) return adapters;

            for (NetworkInterface iface : Collections.list(interfaces)) {
                SystemInfoDto.NetworkAdapter adapter = new SystemInfoDto.NetworkAdapter();
                adapter.setName(iface.getName());
                adapter.setDisplayName(iface.getDisplayName() != null ? iface.getDisplayName() : iface.getName());
                adapter.setUp(iface.isUp());
                adapter.setLoopback(iface.isLoopback());
                adapter.setMtu(iface.getMTU());
                adapter.setMacAddress(formatMac(iface.getHardwareAddress()));

                List<String> ipv4 = new ArrayList<>();
                for (InetAddress address : Collections.list(iface.getInetAddresses())) {
                    if (address instanceof Inet4Address) {
                        ipv4.add(address.getHostAddress());
                    }
                }
                adapter.setIpv4(ipv4);
                adapters.add(adapter);
            }
        } catch (Exception ignored) {
            // Network enumeration is best-effort; never break the diagnostics page.
        }
        return adapters;
    }

    private String formatMac(byte[] mac) {
        if (mac == null || mac.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < mac.length; i++) {
            if (i > 0) sb.append(':');
            sb.append(String.format("%02x", mac[i]));
        }
        return sb.toString();
    }

    private String safeHostname() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (Exception ex) {
            String env = System.getenv("COMPUTERNAME");
            return env != null ? env : "unknown-host";
        }
    }

    private String cpuModel(String fallbackArch) {
        String identifier = System.getenv("PROCESSOR_IDENTIFIER");
        if (identifier != null && !identifier.isBlank()) return identifier.trim();
        String arch = System.getProperty("os.arch");
        return arch != null ? arch : fallbackArch;
    }

    private int scoreFromUsage(double percent, double ok, double warn, double critical) {
        if (percent < 0) return 85;
        if (percent <= ok) return 100;
        if (percent <= warn) return 80;
        if (percent <= critical) return 60;
        return 30;
    }

    private String statusFromScore(int score) {
        if (score >= 80) return "OK";
        if (score >= 60) return "WARN";
        return "CRITICAL";
    }

    private String overallStatus(int score) {
        if (score >= 90) return "EXCELLENT";
        if (score >= 75) return "GOOD";
        if (score >= 60) return "FAIR";
        return "POOR";
    }

    private String humanUptime(long seconds) {
        long days = seconds / 86_400L;
        long hours = (seconds % 86_400L) / 3_600L;
        long minutes = (seconds % 3_600L) / 60L;
        if (days > 0) return days + "d " + hours + "h";
        if (hours > 0) return hours + "h " + minutes + "m";
        return minutes + "m";
    }

    public static String formatBytes(long bytes) {
        if (bytes <= 0) return "0 B";
        String[] units = {"B", "KB", "MB", "GB", "TB", "PB"};
        int index = (int) Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
        double value = bytes / Math.pow(1024, index);
        return String.format(Locale.ROOT, "%.1f %s", value, units[index]);
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
