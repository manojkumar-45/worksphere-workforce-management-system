package com.wms.backend.dto.employee;

import com.wms.backend.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class EmployeeResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String roleTitle;
    private BigDecimal salary;
    private Role role;
    private String departmentName;
    private Long departmentId;
    private String shiftName;
    private Long shiftId;
}
