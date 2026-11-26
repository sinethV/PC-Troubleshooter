package com.techfixpro.repository;

import com.techfixpro.entity.Command;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {

    List<Command> findByCategorySlug(String slug);

    Page<Command> findByCategorySlug(String slug, Pageable pageable);

    List<Command> findByFeaturedTrue();

    List<Command> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Command c WHERE " +
            "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
            "(:riskLevel IS NULL OR c.riskLevel = :riskLevel) AND " +
            "(:query IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.commandSyntax) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.explanation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.purpose) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Command> searchCommands(@Param("categoryId") Long categoryId,
                                 @Param("riskLevel") String riskLevel,
                                 @Param("query") String query,
                                 Pageable pageable);

    long countByRiskLevel(String riskLevel);
}
