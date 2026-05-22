package com.wms.backend.service;

import com.wms.backend.dto.dashboard.DashboardResponse;
import com.wms.backend.dto.dashboard.EmployeeDashboardResponse;

public interface DashboardService {
    DashboardResponse getAdminDashboard();
    EmployeeDashboardResponse getEmployeeDashboard(Long employeeId);
}
