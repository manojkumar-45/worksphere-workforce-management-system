package com.wms.backend.service.impl;

import com.wms.backend.dto.auth.AuthResponse;
import com.wms.backend.dto.auth.LoginRequest;
import com.wms.backend.dto.auth.RegisterRequest;
import com.wms.backend.entity.Department;
import com.wms.backend.entity.Employee;
import com.wms.backend.enums.Role;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.DepartmentRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.security.CustomUserDetails;
import com.wms.backend.security.JwtService;
import com.wms.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (request.getRole() != Role.EMPLOYEE) {
            throw new BadRequestException("Public registration is limited to employee accounts");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }

        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .roleTitle(request.getRoleTitle())
                .salary(request.getSalary())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE)
                .department(department)
                .build();

        Employee saved = employeeRepository.save(employee);
        CustomUserDetails userDetails = new CustomUserDetails(saved);
        return AuthResponse.builder()
                .token(jwtService.generateToken(userDetails))
                .userId(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CustomUserDetails userDetails = new CustomUserDetails(employee);
        return AuthResponse.builder()
                .token(jwtService.generateToken(userDetails))
                .userId(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole())
                .build();
    }
}
