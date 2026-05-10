package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.LoginRequest;
import com.trigao.panificadora.dto.LoginResponse;
import com.trigao.panificadora.dto.RegisterRequest;
import com.trigao.panificadora.model.User;
import com.trigao.panificadora.repository.UserRepository;
import com.trigao.panificadora.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return buildResponse(token, user);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String token = jwtTokenProvider.generateToken(auth);
        User user = (User) auth.getPrincipal();
        return buildResponse(token, user);
    }

    private LoginResponse buildResponse(String token, User user) {
        Long storeId = user.getStore() != null ? user.getStore().getId() : null;
        String storeName = user.getStore() != null ? user.getStore().getName() : null;
        return new LoginResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole(), storeId, storeName);
    }
}
