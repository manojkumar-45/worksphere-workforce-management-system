package com.wms.backend.repository;

import com.wms.backend.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    Page<Attendance> findByEmployeeId(Long employeeId, Pageable pageable);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
    long countByDate(LocalDate date);
    long countByEmployeeId(Long employeeId);
}
