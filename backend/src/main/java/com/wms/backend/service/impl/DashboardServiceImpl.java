package com.wms.backend.service.impl;

import com.wms.backend.dto.dashboard.ChartItem;
import com.wms.backend.dto.dashboard.DashboardResponse;
import com.wms.backend.dto.dashboard.EmployeeDashboardResponse;
import com.wms.backend.entity.Payroll;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.AttendanceRepository;
import com.wms.backend.repository.DepartmentRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.repository.LeaveRequestRepository;
import com.wms.backend.repository.PayrollRepository;
import com.wms.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DepartmentRepository departmentRepository;
    private final PayrollRepository payrollRepository;

    @Override
    public DashboardResponse getAdminDashboard() {
        List<ChartItem> departmentChart = departmentRepository.findAll().stream()
                .map(department -> new ChartItem(department.getName(), department.getEmployees().size()))
                .toList();

        List<ChartItem> attendanceTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            long count = attendanceRepository.findByDateBetween(month.atDay(1), month.atEndOfMonth()).size();
            attendanceTrend.add(new ChartItem(month.toString(), count));
        }

        return DashboardResponse.builder()
                .totalEmployees(employeeRepository.count())
                .todayAttendance(attendanceRepository.countByDate(LocalDate.now()))
                .pendingLeaves(leaveRequestRepository.countByStatus(com.wms.backend.enums.LeaveStatus.PENDING))
                .approvedLeaves(leaveRequestRepository.countByStatus(com.wms.backend.enums.LeaveStatus.APPROVED))
                .employeesByDepartment(departmentChart)
                .monthlyAttendanceTrend(attendanceTrend)
                .build();
    }

    @Override
    public EmployeeDashboardResponse getEmployeeDashboard(Long employeeId) {
        var employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        List<Payroll> payrolls = payrollRepository.findByEmployeeId(employeeId, PageRequest.of(0, 12)).getContent();
        Payroll latest = payrolls.stream().max(Comparator.comparing(Payroll::getPayrollMonth)).orElse(null);
        return EmployeeDashboardResponse.builder()
                .attendanceCount(attendanceRepository.countByEmployeeId(employeeId))
                .pendingLeaves(leaveRequestRepository.countByEmployeeIdAndStatus(employeeId, com.wms.backend.enums.LeaveStatus.PENDING))
                .shiftName(employee.getShift() != null ? employee.getShift().getName() : "Unassigned")
                .latestPayrollMonth(latest != null ? latest.getPayrollMonth().toString() : null)
                .latestNetSalary(latest != null ? latest.getNetSalary().toString() : null)
                .build();
    }
}
