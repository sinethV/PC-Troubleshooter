package com.techfixpro.repository;

import com.techfixpro.entity.ToolUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToolUsageRepository extends JpaRepository<ToolUsage, Long> {
    List<ToolUsage> findTop10ByOrderByExecutedAtDesc();
}
