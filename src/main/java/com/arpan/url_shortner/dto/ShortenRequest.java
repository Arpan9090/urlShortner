package com.arpan.url_shortner.dto;

public class ShortenRequest {
    private String originalUrl;

    public ShortenRequest() {}

    public ShortenRequest(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }
}