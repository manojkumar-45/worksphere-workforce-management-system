package com.wms.backend.service.impl;

import com.wms.backend.dto.shift.ShiftRequest;
import com.wms.backend.dto.shift.ShiftResponse;
import com.wms.backend.entity.Shift;
import com.wms.backend.repository.ShiftRepository;
import com.wms.backend.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;

    @Override
    public ShiftResponse create(ShiftRequest request) {
        Shift saved = shiftRepository.save(Shift.builder()
                .name(request.getName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build());
        return toResponse(saved);
    }

    @Override
    public List<ShiftResponse> getAll() {
        return shiftRepository.findAll().stream().map(this::toResponse).toList();
    }

    private ShiftResponse toResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .name(shift.getName())
                .startTime(shift.getStartTime().toString())
                .endTime(shift.getEndTime().toString())
                .employeeCount(shift.getEmployees() == null ? 0 : shift.getEmployees().size())
                .build();
    }
}
