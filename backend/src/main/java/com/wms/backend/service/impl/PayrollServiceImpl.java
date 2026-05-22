package com.wms.backend.service.impl;

import com.wms.backend.dto.payroll.PayrollGenerateRequest;
import com.wms.backend.dto.payroll.PayrollResponse;
import com.wms.backend.entity.Attendance;
import com.wms.backend.entity.Employee;
import com.wms.backend.entity.LeaveRequest;
import com.wms.backend.entity.Payroll;
import com.wms.backend.enums.LeaveStatus;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.AttendanceRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.repository.LeaveRequestRepository;
import com.wms.backend.repository.PayrollRepository;
import com.wms.backend.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Override
    public PayrollResponse generate(PayrollGenerateRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        YearMonth payrollMonth = YearMonth.parse(request.getPayrollMonth());

        payrollRepository.findByEmployeeIdAndPayrollMonth(employee.getId(), payrollMonth).ifPresent(existing -> {
            throw new BadRequestException("Payroll already generated for this month");
        });

        int workingDays = payrollMonth.lengthOfMonth();
        BigDecimal dailySalary = employee.getSalary().divide(BigDecimal.valueOf(workingDays), 2, RoundingMode.HALF_UP);

        LocalDate start = payrollMonth.atDay(1);
        LocalDate end = payrollMonth.atEndOfMonth();
//        List<Attendance> attendanceList = attendanceRepository.findByDateBetween(start, end).stream()
//                .filter(item -> item.getEmployee().getId().equals(employee.getId()))
//                .toList();
        List<Attendance> attendanceList =
                attendanceRepository.findByEmployeeIdAndDateBetween(employee.getId(), start, end);
//        long presentDays = attendanceList.stream().filter(item -> item.getCheckInTime() != null).count();
        long presentDays = attendanceList.stream()
                .filter(a -> a.getCheckInTime() != null)
                .map(Attendance::getDate)
                .distinct()
                .count();
//        long approvedLeaveDays = leaveRequestRepository.countByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
//                employee.getId(), LeaveStatus.APPROVED, end, start);
        List<LeaveRequest> leaves = leaveRequestRepository
                .findByEmployeeIdAndStatus(employee.getId(), LeaveStatus.APPROVED);

        long approvedLeaveDays = leaves.stream().mapToLong(leave -> {
            LocalDate leaveStart = leave.getStartDate().isBefore(start) ? start : leave.getStartDate();
            LocalDate leaveEnd = leave.getEndDate().isAfter(end) ? end : leave.getEndDate();
            return java.time.temporal.ChronoUnit.DAYS.between(leaveStart, leaveEnd) + 1;
        }).sum();


        long absences = Math.max(0, workingDays - presentDays - approvedLeaveDays);
        BigDecimal attendanceDeductions = dailySalary.multiply(BigDecimal.valueOf(absences));
        BigDecimal leaveDeductions = BigDecimal.ZERO;
        BigDecimal totalDeductions = attendanceDeductions.add(leaveDeductions);
        BigDecimal netSalary = employee.getSalary().subtract(totalDeductions).max(BigDecimal.ZERO);

        Payroll payroll = payrollRepository.save(Payroll.builder()
                .employee(employee)
                .payrollMonth(payrollMonth)
                .basicSalary(employee.getSalary())
                .attendanceDeductions(attendanceDeductions)
                .leaveDeductions(leaveDeductions)
                .totalDeductions(totalDeductions)
                .netSalary(netSalary)
                .generatedAt(java.time.LocalDateTime.now())
                .build());
        return toResponse(payroll);
    }

    @Override
    public Page<PayrollResponse> getAll(Long employeeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "generatedAt"));
        Page<Payroll> result = employeeId == null ? payrollRepository.findAll(pageable) : payrollRepository.findByEmployeeId(employeeId, pageable);
        return result.map(this::toResponse);
    }

    private PayrollResponse toResponse(Payroll payroll) {
        return PayrollResponse.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee().getId())
                .employeeName(payroll.getEmployee().getName())
                .payrollMonth(payroll.getPayrollMonth().toString())
                .basicSalary(payroll.getBasicSalary())
                .attendanceDeductions(payroll.getAttendanceDeductions())
                .leaveDeductions(payroll.getLeaveDeductions())
                .totalDeductions(payroll.getTotalDeductions())
                .netSalary(payroll.getNetSalary())
                .generatedAt(payroll.getGeneratedAt().toString())
                .build();
    }
}
