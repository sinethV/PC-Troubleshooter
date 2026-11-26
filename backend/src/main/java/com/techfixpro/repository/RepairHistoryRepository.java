package com.techfixpro.repository;

import com.techfixpro.entity.RepairHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairHistoryRepository extends JpaRepository<RepairHistory, Long> {
    List<RepairHistory> findByTicketIdOrderByCompletedAtDesc(Long ticketId);
    List<RepairHistory> findTop5ByOrderByCompletedAtDesc();
}
