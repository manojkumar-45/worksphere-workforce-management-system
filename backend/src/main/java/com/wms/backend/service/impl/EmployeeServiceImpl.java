package com.wms.backend.service.impl;

import com.wms.backend.dto.employee.EmployeeRequest;
import com.wms.backend.dto.employee.EmployeeResponse;
import com.wms.backend.entity.Department;
import com.wms.backend.entity.Employee;
import com.wms.backend.entity.Shift;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.DepartmentRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.repository.ShiftRepository;
import com.wms.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final ShiftRepository shiftRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }
        Employee employee = new Employee();
        applyRequest(employee, request, true);
        return toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        if (!employee.getEmail().equalsIgnoreCase(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }
        applyRequest(employee, request, false);
        return toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse getById(Long id) {
        return toResponse(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found")));
    }

    @Override
    public Page<EmployeeResponse> getAll(String search, int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Employee> data = (search == null || search.isBlank())
                ? employeeRepository.findAll(pageable)
                : employeeRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        return data.map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employeeRepository.delete(employee);
    }

    private void applyRequest(Employee employee, EmployeeRequest request, boolean creating) {
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setRoleTitle(request.getRoleTitle());
        employee.setSalary(request.getSalary());
        employee.setRole(request.getRole());

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }
        Shift shift = null;
        if (request.getShiftId() != null) {
            shift = shiftRepository.findById(request.getShiftId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shift not found"));
        }

        employee.setDepartment(department);
        employee.setShift(shift);

        if (creating) {
            String rawPassword = request.getPassword() == null || request.getPassword().isBlank() ? "Password@123" : request.getPassword();
            employee.setPassword(passwordEncoder.encode(rawPassword));
            employee.setActive(true);
        } else if (request.getPassword() != null && !request.getPassword().isBlank()) {
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
        }
    }

    private EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .roleTitle(employee.getRoleTitle())
                .salary(employee.getSalary())
                .role(employee.getRole())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null)
                .shiftId(employee.getShift() != null ? employee.getShift().getId() : null)
                .shiftName(employee.getShift() != null ? employee.getShift().getName() : null)
                .build();
    }
}
