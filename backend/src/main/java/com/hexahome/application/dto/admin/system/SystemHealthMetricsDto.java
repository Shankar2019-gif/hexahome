package com.hexahome.application.dto.admin.system;

import java.time.Instant;

public class SystemHealthMetricsDto {

    private long heapMemoryUsedBytes;
    private long heapMemoryMaxBytes;
    private long nonHeapMemoryUsedBytes;
    private int availableProcessors;
    private long uptimeMillis;
    private int liveThreadCount;
    private int peakThreadCount;
    private String javaVersion;
    private String osName;
    private Instant timestamp;

    public SystemHealthMetricsDto() {
    }

    public long getHeapMemoryUsedBytes() {
        return heapMemoryUsedBytes;
    }

    public void setHeapMemoryUsedBytes(long heapMemoryUsedBytes) {
        this.heapMemoryUsedBytes = heapMemoryUsedBytes;
    }

    public long getHeapMemoryMaxBytes() {
        return heapMemoryMaxBytes;
    }

    public void setHeapMemoryMaxBytes(long heapMemoryMaxBytes) {
        this.heapMemoryMaxBytes = heapMemoryMaxBytes;
    }

    public long getNonHeapMemoryUsedBytes() {
        return nonHeapMemoryUsedBytes;
    }

    public void setNonHeapMemoryUsedBytes(long nonHeapMemoryUsedBytes) {
        this.nonHeapMemoryUsedBytes = nonHeapMemoryUsedBytes;
    }

    public int getAvailableProcessors() {
        return availableProcessors;
    }

    public void setAvailableProcessors(int availableProcessors) {
        this.availableProcessors = availableProcessors;
    }

    public long getUptimeMillis() {
        return uptimeMillis;
    }

    public void setUptimeMillis(long uptimeMillis) {
        this.uptimeMillis = uptimeMillis;
    }

    public int getLiveThreadCount() {
        return liveThreadCount;
    }

    public void setLiveThreadCount(int liveThreadCount) {
        this.liveThreadCount = liveThreadCount;
    }

    public int getPeakThreadCount() {
        return peakThreadCount;
    }

    public void setPeakThreadCount(int peakThreadCount) {
        this.peakThreadCount = peakThreadCount;
    }

    public String getJavaVersion() {
        return javaVersion;
    }

    public void setJavaVersion(String javaVersion) {
        this.javaVersion = javaVersion;
    }

    public String getOsName() {
        return osName;
    }

    public void setOsName(String osName) {
        this.osName = osName;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
