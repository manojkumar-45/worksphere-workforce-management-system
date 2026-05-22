package com.wms.backend.dto.employee;

import com.wms.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EmployeeRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String roleTitle;

    @NotNull
    @Positive
    private BigDecimal salary;

    @NotNull
    private Role role;

    private Long departmentId;
    private Long shiftId;
    private String password;
}
