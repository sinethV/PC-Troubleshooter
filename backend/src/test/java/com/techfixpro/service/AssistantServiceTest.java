package com.techfixpro.service;

import com.techfixpro.dto.assistant.AssistantAnswerDto;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import com.techfixpro.entity.TroubleshootingGuide;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.TroubleshootingGuideRepository;
import com.techfixpro.service.impl.AssistantServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AssistantServiceTest {

    private CommandRepository commandRepository;
    private TroubleshootingGuideRepository guideRepository;
    private AssistantService service;

    @BeforeEach
    void setUp() {
        commandRepository = mock(CommandRepository.class);
        guideRepository = mock(TroubleshootingGuideRepository.class);
        service = new AssistantServiceImpl(commandRepository, guideRepository);
    }

    @Test
    void ranksDnsCommandForDnsSymptom() {
        Category network = category("Network Diagnostics", "networking");

        Command dns = command("Flush DNS Resolver Cache",
                "ipconfig /flushdns",
                "Clears the local DNS resolver cache.",
                "Resolve stale or poisoned DNS records",
                "Websites not loading, DNS resolution failures",
                "SAFE", network);

        Command printer = command("Restart Print Spooler",
                "net stop spooler && net start spooler",
                "Restarts the print spooler service.",
                "Recover stuck print jobs",
                "Printer queue stuck",
                "MODERATE", category("Printer Support", "printers"));

        when(commandRepository.findAll()).thenReturn(List.of(printer, dns));
        when(guideRepository.findAll()).thenReturn(List.of());

        AssistantAnswerDto answer = service.ask("dns is not resolving, websites fail");

        assertFalse(answer.getCommands().isEmpty());
        assertEquals("Flush DNS Resolver Cache", answer.getCommands().get(0).getName());
        assertTrue(answer.getCommands().get(0).getScore() > 0);
        assertFalse(answer.getCommands().get(0).getWhy().isBlank());
        assertTrue(answer.getMatchedTerms().contains("dns"));
    }

    @Test
    void returnsGuideForMatchingSymptoms() {
        Category network = category("Network Diagnostics", "networking");

        TroubleshootingGuide guide = new TroubleshootingGuide();
        guide.setId(7L);
        guide.setTitle("Wi-Fi keeps disconnecting");
        guide.setDescription("Step-by-step isolation of intermittent wireless drops.");
        guide.setSymptoms("wifi drops, disconnects randomly, unstable wireless");
        guide.setDifficulty("INTERMEDIATE");
        guide.setEstimatedTimeMinutes(20);
        guide.setCategory(network);

        when(commandRepository.findAll()).thenReturn(List.of());
        when(guideRepository.findAll()).thenReturn(List.of(guide));

        AssistantAnswerDto answer = service.ask("my wifi keeps disconnecting randomly");

        assertEquals(1, answer.getGuides().size());
        assertEquals("Wi-Fi keeps disconnecting", answer.getGuides().get(0).getTitle());
    }

    @Test
    void doesNotRecommendUnrelatedGuideForSingleGenericWord() {
        Category printers = category("Printer Support", "printers");
        Category windows = category("Windows Troubleshooting", "windows");

        Command spooler = command("Restart Print Spooler",
                "Restart-Service -Name Spooler -Force",
                "Restarts the print spooler service.",
                "Recover stuck print jobs",
                "Printer queue stuck",
                "MODERATE", printers);

        TroubleshootingGuide updateGuide = new TroubleshootingGuide();
        updateGuide.setId(9L);
        updateGuide.setTitle("Windows Update stuck at 0%");
        updateGuide.setDescription("Repair the component store before retrying the update.");
        updateGuide.setSymptoms("update stuck at 0 percent, error 0x80070002");
        updateGuide.setDifficulty("ADVANCED");
        updateGuide.setEstimatedTimeMinutes(45);
        updateGuide.setCategory(windows);

        when(commandRepository.findAll()).thenReturn(List.of(spooler));
        when(guideRepository.findAll()).thenReturn(List.of(updateGuide));

        AssistantAnswerDto answer = service.ask("printer queue is stuck");

        assertEquals("Restart Print Spooler", answer.getCommands().get(0).getName());
        assertTrue(answer.getGuides().isEmpty(),
                "A Windows Update guide must not be suggested for a printer problem");
    }

    @Test
    void emptyQuestionReturnsTopicsInsteadOfInventingAnAnswer() {
        AssistantAnswerDto answer = service.ask("   ");

        assertTrue(answer.getCommands().isEmpty());
        assertTrue(answer.getGuides().isEmpty());
        assertFalse(answer.getSuggestions().isEmpty());
        assertTrue(answer.getSummary().toLowerCase().contains("describe"));
    }

    @Test
    void unknownProblemIsHonestAndSuggestsTopics() {
        when(commandRepository.findAll()).thenReturn(List.of());
        when(guideRepository.findAll()).thenReturn(List.of());

        AssistantAnswerDto answer = service.ask("quantum flux capacitor misalignment");

        assertTrue(answer.getCommands().isEmpty());
        assertTrue(answer.getGuides().isEmpty());
        assertTrue(answer.getSummary().contains("No library entry matches"));
        assertFalse(answer.getSuggestions().isEmpty());
    }

    private Category category(String name, String slug) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        return category;
    }

    private Command command(String name, String syntax, String explanation, String purpose,
                            String whenToUse, String risk, Category category) {
        Command command = new Command();
        command.setId(1L);
        command.setName(name);
        command.setCommandSyntax(syntax);
        command.setExplanation(explanation);
        command.setPurpose(purpose);
        command.setWhenToUse(whenToUse);
        command.setRiskLevel(risk);
        command.setRequiredPermissions("Administrator");
        command.setCategory(category);
        return command;
    }
}
