package com.wms.backend.service.impl;

import com.wms.backend.dto.department.DepartmentRequest;
import com.wms.backend.dto.department.DepartmentResponse;
import com.wms.backend.entity.Department;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.repository.DepartmentRepository;
import com.wms.backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentResponse create(DepartmentRequest request) {
        departmentRepository.findByNameIgnoreCase(request.getName()).ifPresent(department -> {
            throw new BadRequestException("Department already exists");
        });
        Department saved = departmentRepository.save(Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build());
        return toResponse(saved);
    }

    @Override
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    private DepartmentResponse toResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .employeeCount(department.getEmployees() == null ? 0 : department.getEmployees().size())
                .build();
    }
}
