package com.arpan.url_shortner.dto;
import java.time.LocalDateTime;

public class UrlResponse {
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private Long clickCount;
    private LocalDateTime createdAt;

    public UrlResponse(String originalUrl, String shortCode, String shortUrl, Long clickCount, LocalDateTime createdAt) {
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
    }

    // Getters
    public String getOriginalUrl() { return originalUrl; }
    public String getShortCode() { return shortCode; }
    public String getShortUrl() { return shortUrl; }
    public Long getClickCount() { return clickCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
