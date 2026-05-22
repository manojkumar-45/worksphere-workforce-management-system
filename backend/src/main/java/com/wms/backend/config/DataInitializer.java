package com.wms.backend.config;

import com.wms.backend.entity.Department;
import com.wms.backend.entity.Employee;
import com.wms.backend.entity.Shift;
import com.wms.backend.enums.Role;
import com.wms.backend.repository.DepartmentRepository;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData(DepartmentRepository departmentRepository,
                               ShiftRepository shiftRepository,
                               EmployeeRepository employeeRepository) {
        return args -> {
            Department engineering = departmentRepository.findByNameIgnoreCase("Engineering")
                    .orElseGet(() -> departmentRepository.save(Department.builder().name("Engineering").description("Product and platform team").build()));
            Department hr = departmentRepository.findByNameIgnoreCase("Human Resources")
                    .orElseGet(() -> departmentRepository.save(Department.builder().name("Human Resources").description("People operations").build()));

            Shift morning = shiftRepository.findAll().stream().filter(shift -> shift.getName().equalsIgnoreCase("Morning Shift"))
                    .findFirst()
                    .orElseGet(() -> shiftRepository.save(Shift.builder().name("Morning Shift").startTime(LocalTime.of(9, 0)).endTime(LocalTime.of(18, 0)).build()));

            if (!employeeRepository.existsByEmail("admin@wms.com")) {
                employeeRepository.save(Employee.builder()
                        .name("System Admin")
                        .email("admin@wms.com")
                        .phone("9999999999")
                        .roleTitle("Administrator")
                        .salary(new BigDecimal("100000"))
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .department(hr)
                        .shift(morning)
                        .build());
            }

            if (!employeeRepository.existsByEmail("employee@wms.com")) {
                employeeRepository.save(Employee.builder()
                        .name("Demo Employee")
                        .email("employee@wms.com")
                        .phone("8888888888")
                        .roleTitle("Software Engineer")
                        .salary(new BigDecimal("50000"))
                        .password(passwordEncoder.encode("Employee@123"))
                        .role(Role.EMPLOYEE)
                        .department(engineering)
                        .shift(morning)
                        .build());
            }
        };
    }
}
