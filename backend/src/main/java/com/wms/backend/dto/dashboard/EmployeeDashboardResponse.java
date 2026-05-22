package com.wms.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class EmployeeDashboardResponse {
    private long attendanceCount;
    private long pendingLeaves;
    private String shiftName;
    private String latestPayrollMonth;
    private String latestNetSalary;
}
