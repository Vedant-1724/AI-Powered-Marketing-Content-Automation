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
@Table(name = "subscriptions")
public class Subscription {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "tenant_id", nullable = false, unique = true)
  private String tenantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private SubscriptionPlan plan = SubscriptionPlan.FREE;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

  // Razorpay IDs
  private String razorpayCustomerId;
  private String razorpaySubscriptionId;
  private String razorpayPlanId;

  // Billing
  @Column(nullable = false)
  @Builder.Default
  private String currency = "USD";
  @Column(nullable = false)
  @Builder.Default
  private String country = "US";
  @Builder.Default
  private Double amount = 0.0;

  // Usage tracking
  @Builder.Default
  private Integer contentGenerations = 0;
  @Builder.Default
  private Integer campaignsCreated = 0;
  @Builder.Default
  private Integer emailsSent = 0;
  @Builder.Default
  private Integer scheduledPosts = 0;

  // Limits (based on plan)
  @Builder.Default
  private Integer maxContentGenerations = 10;
  @Builder.Default
  private Integer maxCampaigns = 3;
  @Builder.Default
  private Integer maxEmailsPerMonth = 100;
  @Builder.Default
  private Integer maxScheduledPosts = 10;

  // Dates
  private LocalDateTime currentPeriodStart;
  private LocalDateTime currentPeriodEnd;
  private LocalDateTime cancelledAt;

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

  public enum SubscriptionPlan {
    FREE, STARTER, PROFESSIONAL, ENTERPRISE
  }

  public enum SubscriptionStatus {
    ACTIVE, PAST_DUE, CANCELLED, TRIALING, PAUSED
  }
}
