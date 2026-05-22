package com.wms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "payrolls", uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "payroll_month"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payroll_month", nullable = false)
    private YearMonth payrollMonth;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal attendanceDeductions;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal leaveDeductions;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDeductions;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
