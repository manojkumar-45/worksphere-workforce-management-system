package com.wms.backend.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private boolean success;
    private String message;
    private T data;
}
