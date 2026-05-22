package com.wms.backend.service;

import com.wms.backend.dto.auth.AuthResponse;
import com.wms.backend.dto.auth.LoginRequest;
import com.wms.backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
