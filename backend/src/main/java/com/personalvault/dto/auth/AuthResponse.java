package com.personalvault.dto.auth;

public class AuthResponse {

    private String token;
    private UserProfileDTO user;

    public AuthResponse(String token, UserProfileDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserProfileDTO getUser() {
        return user;
    }

    public void setUser(UserProfileDTO user) {
        this.user = user;
    }
}
