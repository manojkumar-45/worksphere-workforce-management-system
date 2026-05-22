package com.wms.backend.service;

import com.wms.backend.dto.department.DepartmentRequest;
import com.wms.backend.dto.department.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse create(DepartmentRequest request);
    List<DepartmentResponse> getAll();
}
