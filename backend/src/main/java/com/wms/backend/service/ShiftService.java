package com.wms.backend.service;

import com.wms.backend.dto.shift.ShiftRequest;
import com.wms.backend.dto.shift.ShiftResponse;

import java.util.List;

public interface ShiftService {
    ShiftResponse create(ShiftRequest request);
    List<ShiftResponse> getAll();
}
