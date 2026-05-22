package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.dashboard.DashboardResponse;
import com.wms.backend.dto.dashboard.EmployeeDashboardResponse;
import com.wms.backend.service.CurrentUserService;
import com.wms.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<DashboardResponse> adminDashboard() {
        return success("Dashboard fetched", dashboardService.getAdminDashboard());
    }

    @GetMapping("/employee")
    public ApiResponse<EmployeeDashboardResponse> employeeDashboard() {
        return success("Dashboard fetched", dashboardService.getEmployeeDashboard(currentUserService.getCurrentUser().getId()));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
