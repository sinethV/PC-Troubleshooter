package com.techfixpro.dto.assistant;

import java.util.ArrayList;
import java.util.List;

/**
 * Answer produced by the built-in knowledge-base assistant.
 * Every recommendation is backed by a real row from the command/guide library.
 */
public class AssistantAnswerDto {

    private String query;
    private String summary;
    private boolean llmConfigured;
    private List<String> matchedTerms = new ArrayList<>();
    private List<CommandMatch> commands = new ArrayList<>();
    private List<GuideMatch> guides = new ArrayList<>();
    private List<String> suggestions = new ArrayList<>();

    public static class CommandMatch {
        private Long id;
        private String name;
        private String commandSyntax;
        private String riskLevel;
        private String requiredPermissions;
        private String categoryName;
        private String purpose;
        private String whenToUse;
        private double score;
        private String why;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCommandSyntax() { return commandSyntax; }
        public void setCommandSyntax(String commandSyntax) { this.commandSyntax = commandSyntax; }
        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
        public String getRequiredPermissions() { return requiredPermissions; }
        public void setRequiredPermissions(String requiredPermissions) { this.requiredPermissions = requiredPermissions; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getPurpose() { return purpose; }
        public void setPurpose(String purpose) { this.purpose = purpose; }
        public String getWhenToUse() { return whenToUse; }
        public void setWhenToUse(String whenToUse) { this.whenToUse = whenToUse; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public String getWhy() { return why; }
        public void setWhy(String why) { this.why = why; }
    }

    public static class GuideMatch {
        private Long id;
        private String title;
        private String description;
        private String symptoms;
        private String difficulty;
        private int estimatedTimeMinutes;
        private String categoryName;
        private double score;
        private String why;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public int getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
        public void setEstimatedTimeMinutes(int estimatedTimeMinutes) { this.estimatedTimeMinutes = estimatedTimeMinutes; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public String getWhy() { return why; }
        public void setWhy(String why) { this.why = why; }
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public boolean isLlmConfigured() { return llmConfigured; }
    public void setLlmConfigured(boolean llmConfigured) { this.llmConfigured = llmConfigured; }
    public List<String> getMatchedTerms() { return matchedTerms; }
    public void setMatchedTerms(List<String> matchedTerms) { this.matchedTerms = matchedTerms; }
    public List<CommandMatch> getCommands() { return commands; }
    public void setCommands(List<CommandMatch> commands) { this.commands = commands; }
    public List<GuideMatch> getGuides() { return guides; }
    public void setGuides(List<GuideMatch> guides) { this.guides = guides; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
