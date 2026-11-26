package com.techfixpro.dto.dashboard;

import com.techfixpro.dto.category.CategoryResponse;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.dto.guide.GuideResponse;

import java.util.List;

public class DashboardSummaryDto {
    private long totalCommands;
    private long totalGuides;
    private long totalCustomers;
    private long totalTickets;
    private long openTickets;
    private long resolvedTickets;
    private long safeCommandsCount;
    private long moderateCommandsCount;
    private long highRiskCommandsCount;

    private List<CategoryResponse> categories;
    private List<CommandResponse> recentCommands;
    private List<CommandResponse> featuredCommands;
    private List<GuideResponse> recentGuides;

    public DashboardSummaryDto() {}

    public long getTotalCommands() {
        return totalCommands;
    }

    public void setTotalCommands(long totalCommands) {
        this.totalCommands = totalCommands;
    }

    public long getTotalGuides() {
        return totalGuides;
    }

    public void setTotalGuides(long totalGuides) {
        this.totalGuides = totalGuides;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(long openTickets) {
        this.openTickets = openTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(long resolvedTickets) {
        this.resolvedTickets = resolvedTickets;
    }

    public long getSafeCommandsCount() {
        return safeCommandsCount;
    }

    public void setSafeCommandsCount(long safeCommandsCount) {
        this.safeCommandsCount = safeCommandsCount;
    }

    public long getModerateCommandsCount() {
        return moderateCommandsCount;
    }

    public void setModerateCommandsCount(long moderateCommandsCount) {
        this.moderateCommandsCount = moderateCommandsCount;
    }

    public long getHighRiskCommandsCount() {
        return highRiskCommandsCount;
    }

    public void setHighRiskCommandsCount(long highRiskCommandsCount) {
        this.highRiskCommandsCount = highRiskCommandsCount;
    }

    public List<CategoryResponse> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryResponse> categories) {
        this.categories = categories;
    }

    public List<CommandResponse> getRecentCommands() {
        return recentCommands;
    }

    public void setRecentCommands(List<CommandResponse> recentCommands) {
        this.recentCommands = recentCommands;
    }

    public List<CommandResponse> getFeaturedCommands() {
        return featuredCommands;
    }

    public void setFeaturedCommands(List<CommandResponse> featuredCommands) {
        this.featuredCommands = featuredCommands;
    }

    public List<GuideResponse> getRecentGuides() {
        return recentGuides;
    }

    public void setRecentGuides(List<GuideResponse> recentGuides) {
        this.recentGuides = recentGuides;
    }
}
