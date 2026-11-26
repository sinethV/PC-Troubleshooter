package com.techfixpro.dto.guide;

public class GuideStepDto {
    private Long id;
    private int stepNumber;
    private String title;
    private String instruction;
    private Long commandId;
    private String commandSyntax;
    private String commandName;
    private String warningNote;
    private String expectedResult;

    public GuideStepDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public Long getCommandId() {
        return commandId;
    }

    public void setCommandId(Long commandId) {
        this.commandId = commandId;
    }

    public String getCommandSyntax() {
        return commandSyntax;
    }

    public void setCommandSyntax(String commandSyntax) {
        this.commandSyntax = commandSyntax;
    }

    public String getCommandName() {
        return commandName;
    }

    public void setCommandName(String commandName) {
        this.commandName = commandName;
    }

    public String getWarningNote() {
        return warningNote;
    }

    public void setWarningNote(String warningNote) {
        this.warningNote = warningNote;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult;
    }
}
