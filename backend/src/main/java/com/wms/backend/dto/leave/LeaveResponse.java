package com.wms.backend.dto.leave;

import com.wms.backend.enums.LeaveStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LeaveResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
}
