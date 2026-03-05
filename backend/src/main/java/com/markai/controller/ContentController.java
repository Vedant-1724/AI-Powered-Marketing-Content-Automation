package com.markai.controller;

import com.markai.dto.ContentGenerateRequest;
import com.markai.dto.ContentGenerateResponse;
import com.markai.model.User;
import com.markai.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ContentGenerateResponse> generateContent(
            @Valid @RequestBody ContentGenerateRequest request,
            @AuthenticationPrincipal User user) {
        try {
            ContentGenerateResponse response = contentService.generateContent(request, user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getContentHistory(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contentService.getContentHistory(user.getTenantId()));
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<Map<String, String>> toggleFavorite(@PathVariable Long id) {
        contentService.toggleFavorite(id);
        return ResponseEntity.ok(Map.of("message", "Favorite toggled"));
    }
}
