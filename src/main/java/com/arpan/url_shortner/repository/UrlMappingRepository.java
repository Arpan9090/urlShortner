package com.arpan.url_shortner.repository;


import com.arpan.url_shortner.entity.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    // Custom query method generated automatically by Spring Data JPA
    Optional<UrlMapping> findByShortCode(String shortCode);

    // Helper to check if a shortCode already exists to handle collisions
    boolean existsByShortCode(String shortCode);
}
