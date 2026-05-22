package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.leave.LeaveRequestDto;
import com.wms.backend.dto.leave.LeaveResponse;
import com.wms.backend.dto.leave.LeaveStatusUpdateRequest;
import com.wms.backend.service.CurrentUserService;
import com.wms.backend.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;
    private final CurrentUserService currentUserService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ApiResponse<LeaveResponse> apply(@Valid @RequestBody LeaveRequestDto request) {
        return success("Leave applied", leaveService.apply(currentUserService.getCurrentUser().getId(), request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<LeaveResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody LeaveStatusUpdateRequest request) {
        return success("Leave updated", leaveService.updateStatus(id, currentUserService.getCurrentUser().getUsername(), request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<Page<LeaveResponse>> getAll(@RequestParam(required = false) Long employeeId,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return success("Leaves fetched", leaveService.getAll(employeeId, page, size));
    }

    @GetMapping("/me")
    public ApiResponse<Page<LeaveResponse>> getMine(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        return success("Leaves fetched", leaveService.getAll(currentUserService.getCurrentUser().getId(), page, size));
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
