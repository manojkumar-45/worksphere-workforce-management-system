package com.wms.backend.service;

import com.wms.backend.dto.attendance.AttendanceResponse;
import org.springframework.data.domain.Page;

public interface AttendanceService {
    AttendanceResponse checkIn(Long employeeId);
    AttendanceResponse checkOut(Long employeeId);
    Page<AttendanceResponse> getAll(Long employeeId, int page, int size);
}
