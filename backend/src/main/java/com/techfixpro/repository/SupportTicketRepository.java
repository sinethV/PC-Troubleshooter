package com.techfixpro.repository;

import com.techfixpro.entity.SupportTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    Page<SupportTicket> findByStatus(String status, Pageable pageable);
    long countByStatus(String status);
    List<SupportTicket> findTop5ByOrderByCreatedAtDesc();
}
