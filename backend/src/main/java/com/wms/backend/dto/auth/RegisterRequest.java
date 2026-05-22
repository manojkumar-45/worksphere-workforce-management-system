package com.wms.backend.dto.auth;

import com.wms.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegisterRequest {
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

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    private Long departmentId;
}
