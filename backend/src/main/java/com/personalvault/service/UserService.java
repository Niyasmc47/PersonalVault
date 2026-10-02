package com.personalvault.service;

import com.personalvault.dto.UserProfileDTO;
import com.personalvault.dto.PasswordUpdateRequest;
import com.personalvault.entity.User;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.UserMapper;
import com.personalvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserMapper.toProfileDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UserProfileDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (updateRequest.getName() != null && !updateRequest.getName().isBlank()) {
            user.setName(updateRequest.getName().trim());
        }

        // Email is intentionally not updated to keep things simple for Phase 1

        user = userRepository.save(user);
        return UserMapper.toProfileDTO(user);
    }

    @Transactional
    public void updatePassword(String email, PasswordUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new InvalidRequestException("New password cannot be empty");
        }

        if (user.getPasswordHash() != null) {
            if (request.getOldPassword() == null || !passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                throw new InvalidRequestException("Incorrect old password");
            }
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
