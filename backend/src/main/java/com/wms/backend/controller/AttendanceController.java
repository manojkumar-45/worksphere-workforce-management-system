package com.wms.backend.controller;

import com.wms.backend.dto.attendance.AttendanceResponse;
import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.service.AttendanceService;
import com.wms.backend.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final CurrentUserService currentUserService;

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<AttendanceResponse> checkIn() {
        return success("Check-in successful", attendanceService.checkIn(currentUserService.getCurrentUser().getId()));
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<AttendanceResponse> checkOut() {
        return success("Check-out successful", attendanceService.checkOut(currentUserService.getCurrentUser().getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<Page<AttendanceResponse>> getAll(@RequestParam(required = false) Long employeeId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return success("Attendance fetched", attendanceService.getAll(employeeId, page, size));
    }

    @GetMapping("/me")
    public ApiResponse<Page<AttendanceResponse>> getMine(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return success("Attendance fetched", attendanceService.getAll(currentUserService.getCurrentUser().getId(), page, size));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
