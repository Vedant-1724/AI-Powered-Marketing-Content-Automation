package com.markai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "analytics_snapshots")
public class AnalyticsSnapshot {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "snapshot_date", nullable = false)
  private LocalDate snapshotDate;

  @Column(name = "tenant_id", nullable = false)
  private String tenantId;

  // Campaign metrics
  @Builder.Default
  private Integer totalCampaigns = 0;
  @Builder.Default
  private Integer activeCampaigns = 0;
  @Builder.Default
  private Integer completedCampaigns = 0;

  // Content metrics
  @Builder.Default
  private Integer contentGenerated = 0;

  // Engagement metrics
  @Builder.Default
  private Long totalImpressions = 0L;
  @Builder.Default
  private Long totalClicks = 0L;
  @Builder.Default
  private Long totalConversions = 0L;
  @Builder.Default
  private Double ctr = 0.0;
  @Builder.Default
  private Double conversionRate = 0.0;

  // Email metrics
  @Builder.Default
  private Integer emailsSent = 0;
  @Builder.Default
  private Double avgOpenRate = 0.0;
  @Builder.Default
  private Double avgClickRate = 0.0;

  // Social metrics
  @Builder.Default
  private Integer postsPublished = 0;
  @Builder.Default
  private Long socialReach = 0L;
  @Builder.Default
  private Integer socialEngagements = 0;

  // Revenue (from conversions, estimated)
  @Builder.Default
  private Double estimatedRevenue = 0.0;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();
}
