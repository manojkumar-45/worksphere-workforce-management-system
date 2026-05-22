package com.wms.backend.repository;

import com.wms.backend.entity.LeaveRequest;
import com.wms.backend.enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    Page<LeaveRequest> findByEmployeeId(Long employeeId, Pageable pageable);
//    optioal
    List<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
    long countByStatus(LeaveStatus status);
    long countByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
    long countByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long employeeId, LeaveStatus status, LocalDate endDate, LocalDate startDate);
}
