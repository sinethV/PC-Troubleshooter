package com.techfixpro.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guide_steps", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"guide_id", "step_number"}, name = "uq_guide_step")
})
public class GuideStep extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", nullable = false)
    private TroubleshootingGuide guide;

    @Column(name = "step_number", nullable = false)
    private int stepNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instruction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "command_id")
    private Command command;

    @Column(name = "warning_note", columnDefinition = "TEXT")
    private String warningNote;

    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;

    public GuideStep() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TroubleshootingGuide getGuide() {
        return guide;
    }

    public void setGuide(TroubleshootingGuide guide) {
        this.guide = guide;
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

    public Command getCommand() {
        return command;
    }

    public void setCommand(Command command) {
        this.command = command;
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
