package com.arpan.url_shortner.service;

import com.arpan.url_shortner.dto.ShortenRequest;
import com.arpan.url_shortner.dto.UrlResponse;
import com.arpan.url_shortner.entity.UrlMapping;
import com.arpan.url_shortner.entity.User;
import com.arpan.url_shortner.repository.UrlMappingRepository;
import com.arpan.url_shortner.repository.UserRepository;
import com.arpan.url_shortner.util.Base62;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class UrlService {

    private final UserRepository userRepository;

    private final UrlMappingRepository repository;

    @Value("${app.base-url:http://localhost:8080/}")
    private String baseUrl;

    public UrlService(UserRepository userRepository, UrlMappingRepository repository) {
        this.userRepository = userRepository;
        this.repository = repository;
    }

    @Transactional
    public UrlResponse shortenUrl(ShortenRequest request, String username) {
        String originalUrl = request.getOriginalUrl();

        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            originalUrl = "https://" + originalUrl;
        }

        String shortCode;
        do {
            shortCode = Base62.generateRandomCode(6);
        } while (repository.existsByShortCode(shortCode));

        UrlMapping entity = new UrlMapping(originalUrl, shortCode);

        // If request comes from an authenticated user, associate it
        if (username != null) {
            userRepository.findByUsername(username).ifPresent(entity::setUser);
        }

        UrlMapping savedEntity = repository.save(entity);
        return mapToResponse(savedEntity);
    }

    // Fetch links for logged-in user
    @Transactional(readOnly = true)
    public List<UrlResponse> getUserUrls(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return repository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Method for handling Redirection + Incrementing Clicks
    @Transactional
    public String getOriginalUrlAndIncrementClicks(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short URL not found for code: " + shortCode));

        // Increment click count
        mapping.setClickCount(mapping.getClickCount() + 1);
        repository.save(mapping);

        return mapping.getOriginalUrl();
    }

    // Method for Analytics lookup
    @Transactional(readOnly = true)
    public UrlResponse getAnalytics(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short URL not found for code: " + shortCode));

        return mapToResponse(mapping);
    }

    // Helper method to keep code DRY (Don't Repeat Yourself)
    private UrlResponse mapToResponse(UrlMapping entity) {
        String fullShortUrl = baseUrl + entity.getShortCode();
        return new UrlResponse(
                entity.getOriginalUrl(),
                entity.getShortCode(),
                fullShortUrl,
                entity.getClickCount(),
                entity.getCreatedAt()
        );
    }
}