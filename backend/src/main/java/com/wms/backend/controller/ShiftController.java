package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.shift.ShiftRequest;
import com.wms.backend.dto.shift.ShiftResponse;
import com.wms.backend.service.ShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping
    public ApiResponse<List<ShiftResponse>> getAll() {
        return success("Shifts fetched", shiftService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<ShiftResponse> create(@Valid @RequestBody ShiftRequest request) {
        return success("Shift created", shiftService.create(request));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
