package com.markai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "generated_content")
public class GeneratedContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String tone;

    @Column(name = "generated_text", columnDefinition = "TEXT", nullable = false)
    private String generatedText;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "seo_score")
    private Double seoScore;

    @Column(name = "keywords")
    private String keywords;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_favorite")
    @Builder.Default
    private Boolean isFavorite = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
