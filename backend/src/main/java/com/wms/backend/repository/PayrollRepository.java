package com.wms.backend.repository;

import com.wms.backend.entity.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Optional<Payroll> findByEmployeeIdAndPayrollMonth(Long employeeId, YearMonth payrollMonth);
    Page<Payroll> findByEmployeeId(Long employeeId, Pageable pageable);
}
