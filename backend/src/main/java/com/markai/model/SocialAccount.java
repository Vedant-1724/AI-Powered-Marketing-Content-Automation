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
@Table(name = "social_accounts")
public class SocialAccount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ScheduledPost.Platform platform;

  @Column(name = "account_name", nullable = false)
  private String accountName;

  @Column(name = "account_id")
  private String accountId;

  @Column(name = "access_token", columnDefinition = "TEXT")
  private String accessToken;

  @Column(name = "refresh_token", columnDefinition = "TEXT")
  private String refreshToken;

  @Column(name = "token_expires_at")
  private LocalDateTime tokenExpiresAt;

  @Column(name = "profile_image_url")
  private String profileImageUrl;

  @Column(name = "is_active")
  @Builder.Default
  private Boolean isActive = true;

  @Column(name = "tenant_id", nullable = false)
  private String tenantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "connected_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime connectedAt = LocalDateTime.now();
}
