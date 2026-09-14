package com.personalvault.repository.social;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.social.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {

    List<SocialLink> findByUserOrderByDisplayOrderAscCreatedAtAsc(User user);

    List<SocialLink> findByUserAndIncludeInResumeTrueOrderByDisplayOrderAscCreatedAtAsc(User user);

    Optional<SocialLink> findByIdAndUser(Long id, User user);

    long countByUser(User user);
}

