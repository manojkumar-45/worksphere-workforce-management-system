package com.wms.backend.service.impl;

import com.wms.backend.dto.leave.LeaveRequestDto;
import com.wms.backend.dto.leave.LeaveResponse;
import com.wms.backend.dto.leave.LeaveStatusUpdateRequest;
import com.wms.backend.entity.Employee;
import com.wms.backend.entity.LeaveRequest;
import com.wms.backend.enums.LeaveStatus;
import com.wms.backend.exception.BadRequestException;
import com.wms.backend.exception.ResourceNotFoundException;
import com.wms.backend.repository.EmployeeRepository;
import com.wms.backend.repository.LeaveRequestRepository;
import com.wms.backend.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public LeaveResponse apply(Long employeeId, LeaveRequestDto request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        LeaveRequest saved = leaveRequestRepository.save(LeaveRequest.builder()
                .employee(employee)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build());
        return toResponse(saved);
    }

    @Override
    public LeaveResponse updateStatus(Long leaveId, String reviewerEmail, LeaveStatusUpdateRequest request) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setStatus(request.getStatus());
        leave.setReviewedAt(LocalDateTime.now());
        leave.setReviewedBy(reviewerEmail);
        return toResponse(leaveRequestRepository.save(leave));
    }

    @Override
    public Page<LeaveResponse> getAll(Long employeeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<LeaveRequest> result = employeeId == null
                ? leaveRequestRepository.findAll(pageable)
                : leaveRequestRepository.findByEmployeeId(employeeId, pageable);
        return result.map(this::toResponse);
    }

    private LeaveResponse toResponse(LeaveRequest leave) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .employeeId(leave.getEmployee().getId())
                .employeeName(leave.getEmployee().getName())
                .leaveType(leave.getLeaveType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .appliedAt(leave.getAppliedAt())
                .reviewedAt(leave.getReviewedAt())
                .reviewedBy(leave.getReviewedBy())
                .build();
    }
}
