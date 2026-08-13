package com.arpan.url_shortner.controller;

import com.arpan.url_shortner.dto.ShortenRequest;
import com.arpan.url_shortner.dto.UrlResponse;
import com.arpan.url_shortner.service.UrlService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    // 1. Endpoint to Shorten a URL
    @PostMapping("/api/v1/shorten")
    public ResponseEntity<UrlResponse> shortenUrl(@RequestBody ShortenRequest request, Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        UrlResponse response = urlService.shortenUrl(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/my-urls")
    public ResponseEntity<List<UrlResponse>> getMyUrls(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<UrlResponse> urls = urlService.getUserUrls(principal.getName());
        return ResponseEntity.ok(urls);
    }

    // 2. Endpoint for URL Redirection (GET /{shortCode})
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginalUrl(@PathVariable String shortCode) {
        String originalUrl = urlService.getOriginalUrlAndIncrementClicks(shortCode);

        // HTTP 302 FOUND redirecting to original destination
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(originalUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    // 3. Endpoint for Analytics
    @GetMapping("/api/v1/analytics/{shortCode}")
    public ResponseEntity<UrlResponse> getAnalytics(@PathVariable String shortCode) {
        UrlResponse analytics = urlService.getAnalytics(shortCode);
        return ResponseEntity.ok(analytics);
    }
}