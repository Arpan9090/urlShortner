package com.arpan.url_shortner.service;

import com.arpan.url_shortner.dto.ShortenRequest;
import com.arpan.url_shortner.dto.UrlResponse;
import com.arpan.url_shortner.entity.UrlMapping;
import com.arpan.url_shortner.repository.UrlMappingRepository;
import com.arpan.url_shortner.util.Base62;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UrlService {

    private final UrlMappingRepository repository;

    @Value("${app.base-url:http://localhost:8080/}")
    private String baseUrl;

    public UrlService(UrlMappingRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UrlResponse shortenUrl(ShortenRequest request) {
        String originalUrl = request.getOriginalUrl();

        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            originalUrl = "https://" + originalUrl;
        }

        String shortCode;
        do {
            shortCode = Base62.generateRandomCode(6);
        } while (repository.existsByShortCode(shortCode));

        UrlMapping entity = new UrlMapping(originalUrl, shortCode);
        UrlMapping savedEntity = repository.save(entity);

        return mapToResponse(savedEntity);
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