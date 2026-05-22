package com.wms.backend.dto.payroll;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PayrollGenerateRequest {
    @NotNull
    private Long employeeId;

    @NotBlank
    private String payrollMonth;
}
