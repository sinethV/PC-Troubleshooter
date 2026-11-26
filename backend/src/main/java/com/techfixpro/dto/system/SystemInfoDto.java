package com.techfixpro.dto.system;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Real, read-only snapshot of the machine running the backend.
 * No values are simulated: every field is read from the JVM/OS at request time.
 */
public class SystemInfoDto {

    private String hostname;
    private String osName;
    private String osVersion;
    private String osArch;
    private String javaVersion;
    private String javaVendor;
    private long uptimeSeconds;
    private OffsetDateTime bootTime;
    private OffsetDateTime capturedAt;
    private long processCount;

    private CpuInfo cpu = new CpuInfo();
    private MemoryInfo memory = new MemoryInfo();
    private JvmInfo jvm = new JvmInfo();
    private List<DiskInfo> disks = new ArrayList<>();
    private List<NetworkAdapter> network = new ArrayList<>();

    public static class CpuInfo {
        private String model;
        private int logicalProcessors;
        private double loadPercent;
        private double processLoadPercent;

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public int getLogicalProcessors() { return logicalProcessors; }
        public void setLogicalProcessors(int logicalProcessors) { this.logicalProcessors = logicalProcessors; }
        public double getLoadPercent() { return loadPercent; }
        public void setLoadPercent(double loadPercent) { this.loadPercent = loadPercent; }
        public double getProcessLoadPercent() { return processLoadPercent; }
        public void setProcessLoadPercent(double processLoadPercent) { this.processLoadPercent = processLoadPercent; }
    }

    public static class MemoryInfo {
        private long totalBytes;
        private long usedBytes;
        private long freeBytes;
        private double usedPercent;

        public long getTotalBytes() { return totalBytes; }
        public void setTotalBytes(long totalBytes) { this.totalBytes = totalBytes; }
        public long getUsedBytes() { return usedBytes; }
        public void setUsedBytes(long usedBytes) { this.usedBytes = usedBytes; }
        public long getFreeBytes() { return freeBytes; }
        public void setFreeBytes(long freeBytes) { this.freeBytes = freeBytes; }
        public double getUsedPercent() { return usedPercent; }
        public void setUsedPercent(double usedPercent) { this.usedPercent = usedPercent; }
    }

    public static class JvmInfo {
        private long heapUsedBytes;
        private long heapMaxBytes;
        private double heapUsedPercent;

        public long getHeapUsedBytes() { return heapUsedBytes; }
        public void setHeapUsedBytes(long heapUsedBytes) { this.heapUsedBytes = heapUsedBytes; }
        public long getHeapMaxBytes() { return heapMaxBytes; }
        public void setHeapMaxBytes(long heapMaxBytes) { this.heapMaxBytes = heapMaxBytes; }
        public double getHeapUsedPercent() { return heapUsedPercent; }
        public void setHeapUsedPercent(double heapUsedPercent) { this.heapUsedPercent = heapUsedPercent; }
    }

    public static class DiskInfo {
        private String name;
        private String type;
        private long totalBytes;
        private long freeBytes;
        private long usableBytes;
        private double usedPercent;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public long getTotalBytes() { return totalBytes; }
        public void setTotalBytes(long totalBytes) { this.totalBytes = totalBytes; }
        public long getFreeBytes() { return freeBytes; }
        public void setFreeBytes(long freeBytes) { this.freeBytes = freeBytes; }
        public long getUsableBytes() { return usableBytes; }
        public void setUsableBytes(long usableBytes) { this.usableBytes = usableBytes; }
        public double getUsedPercent() { return usedPercent; }
        public void setUsedPercent(double usedPercent) { this.usedPercent = usedPercent; }
    }

    public static class NetworkAdapter {
        private String name;
        private String displayName;
        private String macAddress;
        private int mtu;
        private boolean up;
        private boolean loopback;
        private List<String> ipv4 = new ArrayList<>();

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getMacAddress() { return macAddress; }
        public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
        public int getMtu() { return mtu; }
        public void setMtu(int mtu) { this.mtu = mtu; }
        public boolean isUp() { return up; }
        public void setUp(boolean up) { this.up = up; }
        public boolean isLoopback() { return loopback; }
        public void setLoopback(boolean loopback) { this.loopback = loopback; }
        public List<String> getIpv4() { return ipv4; }
        public void setIpv4(List<String> ipv4) { this.ipv4 = ipv4; }
    }

    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public String getOsName() { return osName; }
    public void setOsName(String osName) { this.osName = osName; }
    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }
    public String getOsArch() { return osArch; }
    public void setOsArch(String osArch) { this.osArch = osArch; }
    public String getJavaVersion() { return javaVersion; }
    public void setJavaVersion(String javaVersion) { this.javaVersion = javaVersion; }
    public String getJavaVendor() { return javaVendor; }
    public void setJavaVendor(String javaVendor) { this.javaVendor = javaVendor; }
    public long getUptimeSeconds() { return uptimeSeconds; }
    public void setUptimeSeconds(long uptimeSeconds) { this.uptimeSeconds = uptimeSeconds; }
    public OffsetDateTime getBootTime() { return bootTime; }
    public void setBootTime(OffsetDateTime bootTime) { this.bootTime = bootTime; }
    public OffsetDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(OffsetDateTime capturedAt) { this.capturedAt = capturedAt; }
    public long getProcessCount() { return processCount; }
    public void setProcessCount(long processCount) { this.processCount = processCount; }
    public CpuInfo getCpu() { return cpu; }
    public void setCpu(CpuInfo cpu) { this.cpu = cpu; }
    public MemoryInfo getMemory() { return memory; }
    public void setMemory(MemoryInfo memory) { this.memory = memory; }
    public JvmInfo getJvm() { return jvm; }
    public void setJvm(JvmInfo jvm) { this.jvm = jvm; }
    public List<DiskInfo> getDisks() { return disks; }
    public void setDisks(List<DiskInfo> disks) { this.disks = disks; }
    public List<NetworkAdapter> getNetwork() { return network; }
    public void setNetwork(List<NetworkAdapter> network) { this.network = network; }
}
