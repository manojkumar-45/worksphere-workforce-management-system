package com.wms.backend.dto.shift;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ShiftRequest {
    @NotBlank
    private String name;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;
}
