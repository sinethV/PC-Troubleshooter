package com.techfixpro.service.impl;

import com.techfixpro.dto.common.PageResponse;
import com.techfixpro.dto.guide.GuideRequest;
import com.techfixpro.dto.guide.GuideResponse;
import com.techfixpro.dto.guide.GuideStepDto;
import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import com.techfixpro.entity.GuideStep;
import com.techfixpro.entity.TroubleshootingGuide;
import com.techfixpro.exception.ResourceNotFoundException;
import com.techfixpro.mapper.GuideMapper;
import com.techfixpro.repository.CategoryRepository;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.TroubleshootingGuideRepository;
import com.techfixpro.service.TroubleshootingGuideService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TroubleshootingGuideServiceImpl implements TroubleshootingGuideService {

    private final TroubleshootingGuideRepository guideRepository;
    private final CategoryRepository categoryRepository;
    private final CommandRepository commandRepository;
    private final GuideMapper guideMapper;

    public TroubleshootingGuideServiceImpl(TroubleshootingGuideRepository guideRepository,
                                           CategoryRepository categoryRepository,
                                           CommandRepository commandRepository,
                                           GuideMapper guideMapper) {
        this.guideRepository = guideRepository;
        this.categoryRepository = categoryRepository;
        this.commandRepository = commandRepository;
        this.guideMapper = guideMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GuideResponse> searchGuides(Long categoryId, String difficulty, String query, Pageable pageable) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanDifficulty = (difficulty != null && !difficulty.trim().isEmpty() && !difficulty.equalsIgnoreCase("ALL"))
                ? difficulty.trim().toUpperCase() : null;

        Page<TroubleshootingGuide> page = guideRepository.searchGuides(categoryId, cleanDifficulty, cleanQuery, pageable);
        List<GuideResponse> content = page.getContent().stream()
                .map(guideMapper::toResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuideResponse> getGuidesByCategorySlug(String slug) {
        return guideRepository.findByCategorySlug(slug).stream()
                .map(guideMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuideResponse> getRecentGuides() {
        return guideRepository.findTop4ByOrderByCreatedAtDesc().stream()
                .map(guideMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GuideResponse getGuideById(Long id) {
        TroubleshootingGuide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TroubleshootingGuide", "id", id));
        return guideMapper.toResponse(guide);
    }

    @Override
    public GuideResponse createGuide(GuideRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        TroubleshootingGuide guide = guideMapper.toEntity(request, category);

        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            List<GuideStep> steps = new ArrayList<>();
            for (GuideStepDto stepDto : request.getSteps()) {
                GuideStep step = new GuideStep();
                step.setGuide(guide);
                step.setStepNumber(stepDto.getStepNumber());
                step.setTitle(stepDto.getTitle());
                step.setInstruction(stepDto.getInstruction());
                step.setWarningNote(stepDto.getWarningNote());
                step.setExpectedResult(stepDto.getExpectedResult());

                if (stepDto.getCommandId() != null) {
                    Command command = commandRepository.findById(stepDto.getCommandId()).orElse(null);
                    step.setCommand(command);
                }
                steps.add(step);
            }
            guide.setSteps(steps);
        }

        TroubleshootingGuide saved = guideRepository.save(guide);
        return guideMapper.toResponse(saved);
    }

    @Override
    public void deleteGuide(Long id) {
        if (!guideRepository.existsById(id)) {
            throw new ResourceNotFoundException("TroubleshootingGuide", "id", id);
        }
        guideRepository.deleteById(id);
    }
}
