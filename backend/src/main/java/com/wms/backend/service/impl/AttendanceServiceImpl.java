package com.wms.backend.service.impl;

import com.wms.backend.dto.attendance.AttendanceResponse;
import com.wms.backend.entity.Attendance;
import com.wms.backend.entity.Employee;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.AttendanceRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public AttendanceResponse checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        LocalDate today = LocalDate.now();
        attendanceRepository.findByEmployeeIdAndDate(employeeId, today).ifPresent(existing -> {
            throw new BadRequestException("Employee has already checked in today");
        });
        Attendance attendance = attendanceRepository.save(Attendance.builder()
                .employee(employee)
                .date(today)
                .checkInTime(LocalDateTime.now())
                .build());
        return toResponse(attendance);
    }

    @Override
    public AttendanceResponse checkOut(Long employeeId) {
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDate.now())
                .orElseThrow(() -> new ResourceNotFoundException("No check-in found for today"));
        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("Employee has already checked out today");
        }
        attendance.setCheckOutTime(LocalDateTime.now());
        attendance.computeWorkingMinutes();
        return toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public Page<AttendanceResponse> getAll(Long employeeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<Attendance> result = employeeId == null
                ? attendanceRepository.findAll(pageable)
                : attendanceRepository.findByEmployeeId(employeeId, pageable);
        return result.map(this::toResponse);
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getName())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .totalWorkingMinutes(attendance.getTotalWorkingMinutes())
                .build();
    }
}
