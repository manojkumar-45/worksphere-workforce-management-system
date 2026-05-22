package com.wms.backend.dto.payroll;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayrollResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String payrollMonth;
    private BigDecimal basicSalary;
    private BigDecimal attendanceDeductions;
    private BigDecimal leaveDeductions;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private String generatedAt;
}
