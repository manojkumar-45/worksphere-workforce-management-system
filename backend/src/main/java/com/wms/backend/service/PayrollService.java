package com.wms.backend.service;

import com.wms.backend.dto.payroll.PayrollGenerateRequest;
import com.wms.backend.dto.payroll.PayrollResponse;
import org.springframework.data.domain.Page;

public interface PayrollService {
    PayrollResponse generate(PayrollGenerateRequest request);
    Page<PayrollResponse> getAll(Long employeeId, int page, int size);
}
