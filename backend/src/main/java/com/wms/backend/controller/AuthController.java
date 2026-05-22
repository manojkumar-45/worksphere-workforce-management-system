package com.wms.backend.controller;

import com.wms.backend.dto.auth.AuthResponse;
import com.wms.backend.dto.auth.LoginRequest;
import com.wms.backend.dto.auth.RegisterRequest;
import com.wms.backend.dto.common.ApiResponse;
import com.wms.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .timestamp(LocalDateTime.now())
                .success(true)
                .message("Registration successful")
                .data(authService.register(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .timestamp(LocalDateTime.now())
                .success(true)
                .message("Login successful")
                .data(authService.login(request))
                .build();
    }
}
