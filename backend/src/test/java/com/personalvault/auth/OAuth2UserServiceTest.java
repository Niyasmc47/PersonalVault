package com.personalvault.auth;

import com.personalvault.entity.auth.User;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.security.CustomOAuth2UserService;
import com.personalvault.repository.transaction.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class OAuth2UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    public void testMultipleOAuth2Logins() {
        transactionRepository.deleteAll();
        userRepository.deleteAll();

        // Print all users currently in DB
        System.out.println("===== USERS IN DB =====");
        for (User u : userRepository.findAll()) {
            System.out.println(u.getId() + " | " + u.getEmail() + " | " + u.getName() + " | " + u.getProvider());
        }
        System.out.println("=======================");

        // Simulate login 1
        Map<String, Object> attributes1 = new HashMap<>();
        attributes1.put("email", "user1@gmail.com");
        attributes1.put("name", "User One");
        attributes1.put("sub", "google-sub-1");

        OAuth2User oauthUser1 = new DefaultOAuth2User(Collections.emptyList(), attributes1, "email");
        customOAuth2UserService.processOAuth2User(oauthUser1);

        assertEquals(1, userRepository.count());

        // Simulate login 2
        Map<String, Object> attributes2 = new HashMap<>();
        attributes2.put("email", "user2@gmail.com");
        attributes2.put("name", "User Two");
        attributes2.put("sub", "google-sub-2");

        OAuth2User oauthUser2 = new DefaultOAuth2User(Collections.emptyList(), attributes2, "email");
        customOAuth2UserService.processOAuth2User(oauthUser2);

        assertEquals(2, userRepository.count());
    }
}
