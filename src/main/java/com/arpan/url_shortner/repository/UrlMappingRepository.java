package com.arpan.url_shortner.repository;

import com.arpan.url_shortner.entity.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    Optional<UrlMapping> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    // Fetch history for a specific user
    List<UrlMapping> findByUserIdOrderByCreatedAtDesc(Long userId);
}