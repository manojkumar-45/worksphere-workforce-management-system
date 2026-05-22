package com.wms.backend.dto.shift;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShiftResponse {
    private Long id;
    private String name;
    private String startTime;
    private String endTime;
    private long employeeCount;
}
