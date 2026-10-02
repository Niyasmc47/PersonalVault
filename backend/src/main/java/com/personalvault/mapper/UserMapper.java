package com.personalvault.mapper;

import com.personalvault.dto.UserProfileDTO;
import com.personalvault.entity.User;

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
