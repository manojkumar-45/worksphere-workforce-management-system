package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.payroll.PayrollGenerateRequest;
import com.wms.backend.dto.payroll.PayrollResponse;
import com.wms.backend.service.CurrentUserService;
import com.wms.backend.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollService payrollService;
    private final CurrentUserService currentUserService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<PayrollResponse> generate(@Valid @RequestBody PayrollGenerateRequest request) {
        return success("Payroll generated", payrollService.generate(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<Page<PayrollResponse>> getAll(@RequestParam(required = false) Long employeeId,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return success("Payroll fetched", payrollService.getAll(employeeId, page, size));
    }

    @GetMapping("/me")
    public ApiResponse<Page<PayrollResponse>> getMine(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return success("Payroll fetched", payrollService.getAll(currentUserService.getCurrentUser().getId(), page, size));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
