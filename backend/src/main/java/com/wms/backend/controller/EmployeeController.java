package com.wms.backend.controller;

import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.dto.employee.EmployeeRequest;
import com.wms.backend.dto.employee.EmployeeResponse;
import com.wms.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<Page<EmployeeResponse>> getAll(@RequestParam(required = false) String search,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "id") String sortBy,
                                                      @RequestParam(defaultValue = "asc") String direction) {
        return success("Employees fetched", employeeService.getAll(search, page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<EmployeeResponse> getById(@PathVariable Long id) {
        return success("Employee fetched", employeeService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return success("Employee created", employeeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ApiResponse<EmployeeResponse> update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return success("Employee updated", employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return success("Employee deleted", null);
    }

    private <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder().timestamp(LocalDateTime.now()).success(true).message(message).data(data).build();
    }
}
