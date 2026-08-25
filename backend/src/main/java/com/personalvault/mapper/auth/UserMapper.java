package com.personalvault.mapper.auth;

import com.personalvault.dto.auth.UserProfileDTO;
import com.personalvault.entity.auth.User;

public class UserMapper {

    public static UserProfileDTO toProfileDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
