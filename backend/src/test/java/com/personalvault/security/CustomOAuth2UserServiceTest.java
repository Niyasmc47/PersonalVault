package com.personalvault.security;

import com.personalvault.entity.auth.AuthProvider;
import com.personalvault.entity.auth.User;
import com.personalvault.repository.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomOAuth2UserService customOAuth2UserService;

    private OAuth2User mockGoogleUser;

    @BeforeEach
    void setUp() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", "test@google.com");
        attributes.put("name", "Test User");
        attributes.put("sub", "google123");
        
        mockGoogleUser = new DefaultOAuth2User(
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email");
    }

    @Test
    void testProcessOAuth2User_NewUserCreated() {
        when(userRepository.findByEmail("test@google.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        OAuth2User result = customOAuth2UserService.processOAuth2User(mockGoogleUser);

        assertNotNull(result);
        assertEquals("test@google.com", result.getName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testProcessOAuth2User_ExistingUserFound() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("test@google.com");
        existingUser.setName("Existing User");
        existingUser.setProvider(AuthProvider.LOCAL); // Previously registered manually

        when(userRepository.findByEmail("test@google.com")).thenReturn(Optional.of(existingUser));

        OAuth2User result = customOAuth2UserService.processOAuth2User(mockGoogleUser);

        assertNotNull(result);
        assertEquals("test@google.com", result.getName());
        verify(userRepository, never()).save(any(User.class));
    }
}
