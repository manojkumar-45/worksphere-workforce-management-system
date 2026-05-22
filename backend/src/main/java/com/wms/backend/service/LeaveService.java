package com.wms.backend.service;

import com.wms.backend.dto.leave.LeaveRequestDto;
import com.wms.backend.dto.leave.LeaveResponse;
import com.wms.backend.dto.leave.LeaveStatusUpdateRequest;
import org.springframework.data.domain.Page;

public interface LeaveService {
    LeaveResponse apply(Long employeeId, LeaveRequestDto request);
    LeaveResponse updateStatus(Long leaveId, String reviewerEmail, LeaveStatusUpdateRequest request);
    Page<LeaveResponse> getAll(Long employeeId, int page, int size);
}
