package com.techfixpro.service.impl;

import com.techfixpro.dto.dashboard.DashboardSummaryDto;
import com.techfixpro.mapper.CategoryMapper;
import com.techfixpro.mapper.CommandMapper;
import com.techfixpro.mapper.GuideMapper;
import com.techfixpro.repository.*;
import com.techfixpro.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final CommandRepository commandRepository;
    private final CategoryRepository categoryRepository;
    private final TroubleshootingGuideRepository guideRepository;
    private final CustomerRepository customerRepository;
    private final SupportTicketRepository ticketRepository;
    private final CategoryMapper categoryMapper;
    private final CommandMapper commandMapper;
    private final GuideMapper guideMapper;

    public DashboardServiceImpl(CommandRepository commandRepository,
                                CategoryRepository categoryRepository,
                                TroubleshootingGuideRepository guideRepository,
                                CustomerRepository customerRepository,
                                SupportTicketRepository ticketRepository,
                                CategoryMapper categoryMapper,
                                CommandMapper commandMapper,
                                GuideMapper guideMapper) {
        this.commandRepository = commandRepository;
        this.categoryRepository = categoryRepository;
        this.guideRepository = guideRepository;
        this.customerRepository = customerRepository;
        this.ticketRepository = ticketRepository;
        this.categoryMapper = categoryMapper;
        this.commandMapper = commandMapper;
        this.guideMapper = guideMapper;
    }

    @Override
    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        summary.setTotalCommands(commandRepository.count());
        summary.setTotalGuides(guideRepository.count());
        summary.setTotalCustomers(customerRepository.count());
        summary.setTotalTickets(ticketRepository.count());

        summary.setOpenTickets(ticketRepository.countByStatus("OPEN") + ticketRepository.countByStatus("IN_PROGRESS"));
        summary.setResolvedTickets(ticketRepository.countByStatus("RESOLVED") + ticketRepository.countByStatus("CLOSED"));

        summary.setSafeCommandsCount(commandRepository.countByRiskLevel("SAFE"));
        summary.setModerateCommandsCount(commandRepository.countByRiskLevel("MODERATE"));
        summary.setHighRiskCommandsCount(commandRepository.countByRiskLevel("HIGH") + commandRepository.countByRiskLevel("DANGEROUS"));

        summary.setCategories(categoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList()));

        summary.setRecentCommands(commandRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList()));

        summary.setFeaturedCommands(commandRepository.findByFeaturedTrue().stream()
                .map(commandMapper::toResponse)
                .collect(Collectors.toList()));

        summary.setRecentGuides(guideRepository.findTop4ByOrderByCreatedAtDesc().stream()
                .map(guideMapper::toResponse)
                .collect(Collectors.toList()));

        return summary;
    }
}
