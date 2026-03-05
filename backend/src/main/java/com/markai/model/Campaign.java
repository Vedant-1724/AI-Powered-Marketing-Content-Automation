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
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "campaign_type", nullable = false)
    private CampaignType campaignType;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "target_audience")
    private String targetAudience;

    @Column(name = "platforms")
    private String platforms; // comma-separated: facebook,instagram,linkedin

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Analytics fields
    @Builder.Default
    private Integer impressions = 0;
    @Builder.Default
    private Integer clicks = 0;
    @Builder.Default
    private Integer conversions = 0;
    @Builder.Default
    private Double ctr = 0.0;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum CampaignStatus {
        DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, FAILED
    }

    public enum CampaignType {
        EMAIL, SOCIAL_MEDIA, AD, BLOG, MULTI_CHANNEL
    }
}
