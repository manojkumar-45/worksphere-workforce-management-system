package com.wms.backend.dto.department;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank
    private String name;
    private String description;
}
