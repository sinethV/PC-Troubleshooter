package com.techfixpro.repository;

import com.techfixpro.entity.TroubleshootingGuide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TroubleshootingGuideRepository extends JpaRepository<TroubleshootingGuide, Long> {

    List<TroubleshootingGuide> findByCategorySlug(String slug);

    @Query("SELECT g FROM TroubleshootingGuide g WHERE " +
            "(:categoryId IS NULL OR g.category.id = :categoryId) AND " +
            "(:difficulty IS NULL OR g.difficulty = :difficulty) AND " +
            "(:query IS NULL OR LOWER(g.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(g.symptoms) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<TroubleshootingGuide> searchGuides(@Param("categoryId") Long categoryId,
                                           @Param("difficulty") String difficulty,
                                           @Param("query") String query,
                                           Pageable pageable);

    List<TroubleshootingGuide> findTop4ByOrderByCreatedAtDesc();
}
