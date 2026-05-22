package com.wms.backend.dto.leave;

import com.wms.backend.enums.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeaveStatusUpdateRequest {
    @NotNull
    private LeaveStatus status;
}
