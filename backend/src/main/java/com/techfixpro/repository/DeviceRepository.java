package com.techfixpro.repository;

import com.techfixpro.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByCustomerId(Long customerId);
    Page<Device> findByCustomerId(Long customerId, Pageable pageable);
}
