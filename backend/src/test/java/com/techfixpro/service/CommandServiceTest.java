package com.techfixpro.service;

import com.techfixpro.dto.command.CommandRequest;
import com.techfixpro.dto.command.CommandResponse;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import com.techfixpro.mapper.CommandMapper;
import com.techfixpro.repository.CategoryRepository;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.ToolUsageRepository;
import com.techfixpro.service.impl.CommandServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommandServiceTest {

    @Mock
    private CommandRepository commandRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ToolUsageRepository toolUsageRepository;

    @Mock
    private CommandMapper commandMapper;

    @InjectMocks
    private CommandServiceImpl commandService;

    private Category sampleCategory;
    private Command sampleCommand;
    private CommandResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category();
        sampleCategory.setId(1L);
        sampleCategory.setName("Windows Troubleshooting");
        sampleCategory.setSlug("windows");

        sampleCommand = new Command();
        sampleCommand.setId(10L);
        sampleCommand.setName("SFC Scan");
        sampleCommand.setCommandSyntax("sfc /scannow");
        sampleCommand.setRiskLevel("SAFE");
        sampleCommand.setCategory(sampleCategory);

        sampleResponse = new CommandResponse();
        sampleResponse.setId(10L);
        sampleResponse.setName("SFC Scan");
        sampleResponse.setCommandSyntax("sfc /scannow");
        sampleResponse.setRiskLevel("SAFE");
    }

    @Test
    @DisplayName("Should return command details when valid ID is provided")
    void shouldReturnCommandById() {
        when(commandRepository.findById(10L)).thenReturn(Optional.of(sampleCommand));
        when(commandMapper.toResponse(sampleCommand)).thenReturn(sampleResponse);

        CommandResponse result = commandService.getCommandById(10L);

        assertNotNull(result);
        assertEquals("SFC Scan", result.getName());
        assertEquals("sfc /scannow", result.getCommandSyntax());
        verify(commandRepository, times(1)).findById(10L);
    }

    @Test
    @DisplayName("Should create command successfully with category relationship")
    void shouldCreateCommandSuccessfully() {
        CommandRequest request = new CommandRequest();
        request.setCategoryId(1L);
        request.setName("SFC Scan");
        request.setCommandSyntax("sfc /scannow");
        request.setExplanation("System file integrity verification");
        request.setPurpose("Repair system files");
        request.setRiskLevel("SAFE");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(commandMapper.toEntity(request, sampleCategory)).thenReturn(sampleCommand);
        when(commandRepository.save(sampleCommand)).thenReturn(sampleCommand);
        when(commandMapper.toResponse(sampleCommand)).thenReturn(sampleResponse);

        CommandResponse result = commandService.createCommand(request);

        assertNotNull(result);
        assertEquals("SFC Scan", result.getName());
        verify(commandRepository, times(1)).save(sampleCommand);
    }
}
