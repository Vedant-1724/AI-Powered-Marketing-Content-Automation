package com.markai.service;

import com.markai.dto.ContentGenerateRequest;
import com.markai.dto.ContentGenerateResponse;
import com.markai.model.GeneratedContent;
import com.markai.model.User;
import com.markai.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final WebClient webClient;
    private final ContentRepository contentRepository;

    public ContentService(
            @Value("${ai.service.url}") String aiServiceUrl,
            ContentRepository contentRepository) {
        this.webClient = WebClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
        this.contentRepository = contentRepository;
    }

    public ContentGenerateResponse generateContent(ContentGenerateRequest request, User user) {
        // Build request body for AI service
        Map<String, Object> body = new HashMap<>();
        body.put("content_type", request.getContentType());
        body.put("topic", request.getTopic());
        body.put("tone", request.getTone());

        if (request.getKeywords() != null) body.put("keywords", request.getKeywords());
        if (request.getTargetAudience() != null) body.put("target_audience", request.getTargetAudience());
        if (request.getBrandId() != null) body.put("brand_id", request.getBrandId());
        if (request.getMaxLength() != null) body.put("max_length", request.getMaxLength());
        if (request.getAdditionalInstructions() != null) body.put("additional_instructions", request.getAdditionalInstructions());
        if (request.getPlatform() != null) body.put("platform", request.getPlatform());

        // Call AI service
        ContentGenerateResponse response = webClient.post()
                .uri("/api/content/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(ContentGenerateResponse.class)
                .block();

        // Save to content history
        if (response != null) {
            GeneratedContent savedContent = GeneratedContent.builder()
                    .contentType(request.getContentType())
                    .topic(request.getTopic())
                    .tone(request.getTone())
                    .generatedText(response.getContent())
                    .wordCount(response.getWordCount())
                    .seoScore(response.getSeoScore())
                    .keywords(request.getKeywords() != null ? String.join(",", request.getKeywords()) : null)
                    .tenantId(user.getTenantId())
                    .user(user)
                    .build();
            contentRepository.save(savedContent);
        }

        return response;
    }

    public List<Map<String, Object>> getContentHistory(String tenantId) {
        return contentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId)
                .stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", c.getId());
                    map.put("contentType", c.getContentType());
                    map.put("topic", c.getTopic());
                    map.put("tone", c.getTone());
                    map.put("content", c.getGeneratedText());
                    map.put("wordCount", c.getWordCount());
                    map.put("seoScore", c.getSeoScore());
                    map.put("isFavorite", c.getIsFavorite());
                    map.put("createdAt", c.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public void toggleFavorite(Long contentId) {
        contentRepository.findById(contentId).ifPresent(content -> {
            content.setIsFavorite(!content.getIsFavorite());
            contentRepository.save(content);
        });
    }
}
