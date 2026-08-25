package com.personalvault.service.auth;

import com.personalvault.dto.auth.UserProfileDTO;
import com.personalvault.entity.auth.User;
import com.personalvault.mapper.auth.UserMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.dto.auth.PasswordUpdateRequest;
import com.personalvault.entity.auth.AuthProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toProfileDTO(user);
    }

    public UserProfileDTO updateProfile(String email, UserProfileDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateRequest.getName() != null && !updateRequest.getName().isBlank()) {
            user.setName(updateRequest.getName());
        }
        
        // Email is intentionally not updated to keep things simple for Phase 1
        
        userRepository.save(user);
        return UserMapper.toProfileDTO(user);
    }

    public void updatePassword(String email, PasswordUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPasswordHash() != null) {
            if (request.getOldPassword() == null || !passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                throw new RuntimeException("Incorrect old password");
            }
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
