package com.wms.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponse {
    private long totalEmployees;
    private long todayAttendance;
    private long pendingLeaves;
    private long approvedLeaves;
    private List<ChartItem> employeesByDepartment;
    private List<ChartItem> monthlyAttendanceTrend;
}
