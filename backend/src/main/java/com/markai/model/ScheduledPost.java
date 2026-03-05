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
@Table(name = "scheduled_posts")
public class ScheduledPost {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "campaign_id")
  private Campaign campaign;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Platform platform;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private PostStatus status = PostStatus.PENDING;

  @Column(name = "scheduled_at", nullable = false)
  private LocalDateTime scheduledAt;

  @Column(name = "published_at")
  private LocalDateTime publishedAt;

  @Column(name = "external_post_id")
  private String externalPostId;

  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "tenant_id", nullable = false)
  private String tenantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  // Post-publish analytics
  @Builder.Default
  private Integer likes = 0;
  @Builder.Default
  private Integer shares = 0;
  @Builder.Default
  private Integer comments = 0;
  @Builder.Default
  private Integer reach = 0;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  @PreUpdate
  protected void onUpdate() {
    // auto-timestamp handled
  }

  public enum Platform {
    FACEBOOK, INSTAGRAM, LINKEDIN, TWITTER, EMAIL
  }

  public enum PostStatus {
    PENDING, QUEUED, PUBLISHING, PUBLISHED, FAILED, CANCELLED
  }
}
