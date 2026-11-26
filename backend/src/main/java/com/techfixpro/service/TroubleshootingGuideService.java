package com.techfixpro.service;

import com.techfixpro.dto.common.PageResponse;
import com.techfixpro.dto.guide.GuideRequest;
import com.techfixpro.dto.guide.GuideResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TroubleshootingGuideService {
    PageResponse<GuideResponse> searchGuides(Long categoryId, String difficulty, String query, Pageable pageable);
    List<GuideResponse> getGuidesByCategorySlug(String slug);
    List<GuideResponse> getRecentGuides();
    GuideResponse getGuideById(Long id);
    GuideResponse createGuide(GuideRequest request);
    void deleteGuide(Long id);
}
