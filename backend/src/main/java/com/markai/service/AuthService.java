package com.markai.service;

import com.markai.dto.AuthResponse;
import com.markai.dto.LoginRequest;
import com.markai.dto.RegisterRequest;
import com.markai.model.User;
import com.markai.repository.UserRepository;
import com.markai.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String tenantId = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .companyName(request.getCompanyName())
                .tenantId(tenantId)
                .role(User.Role.USER)
                .subscriptionTier(User.SubscriptionTier.FREE)
                .brandId(tenantId) // brand ID = tenant ID by default
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), tenantId);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .tenantId(tenantId)
                .subscriptionTier(user.getSubscriptionTier().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getTenantId());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .tenantId(user.getTenantId())
                .subscriptionTier(user.getSubscriptionTier().name())
                .build();
    }

    public AuthResponse getCurrentUser(User user) {
        return AuthResponse.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .tenantId(user.getTenantId())
                .subscriptionTier(user.getSubscriptionTier().name())
                .build();
    }
}
