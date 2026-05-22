package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.department.DepartmentRequest;
import com.wms.backend.dto.department.DepartmentResponse;
import com.wms.backend.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ApiResponse<List<DepartmentResponse>> getAll() {
        return success("Departments fetched", departmentService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<DepartmentResponse> create(@Valid @RequestBody DepartmentRequest request) {
        return success("Department created", departmentService.create(request));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
