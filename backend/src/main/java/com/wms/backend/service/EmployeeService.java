package com.wms.backend.service;

import com.wms.backend.dto.employee.EmployeeRequest;
import com.wms.backend.dto.employee.EmployeeResponse;
import org.springframework.data.domain.Page;

public interface EmployeeService {
    EmployeeResponse create(EmployeeRequest request);
    EmployeeResponse update(Long id, EmployeeRequest request);
    EmployeeResponse getById(Long id);
    Page<EmployeeResponse> getAll(String search, int page, int size, String sortBy, String direction);
    void delete(Long id);
}
