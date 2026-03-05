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
@Table(name = "ab_tests")
public class ABTest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "campaign_id", nullable = false)
  private Campaign campaign;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ABTestStatus status = ABTestStatus.DRAFT;

  // Variant A
  @Column(name = "variant_a_content", columnDefinition = "TEXT", nullable = false)
  private String variantAContent;

  @Column(name = "variant_a_subject")
  private String variantASubject;

  @Column(name = "variant_a_impressions")
  @Builder.Default
  private Integer variantAImpressions = 0;

  @Column(name = "variant_a_clicks")
  @Builder.Default
  private Integer variantAClicks = 0;

  @Column(name = "variant_a_conversions")
  @Builder.Default
  private Integer variantAConversions = 0;

  // Variant B
  @Column(name = "variant_b_content", columnDefinition = "TEXT", nullable = false)
  private String variantBContent;

  @Column(name = "variant_b_subject")
  private String variantBSubject;

  @Column(name = "variant_b_impressions")
  @Builder.Default
  private Integer variantBImpressions = 0;

  @Column(name = "variant_b_clicks")
  @Builder.Default
  private Integer variantBClicks = 0;

  @Column(name = "variant_b_conversions")
  @Builder.Default
  private Integer variantBConversions = 0;

  // Split percentage (e.g., 50 = 50/50 split)
  @Column(name = "split_percentage")
  @Builder.Default
  private Integer splitPercentage = 50;

  @Column(name = "winner")
  private String winner; // "A", "B", or null

  @Column(name = "confidence_level")
  private Double confidenceLevel;

  @Column(name = "tenant_id", nullable = false)
  private String tenantId;

  @Column(name = "started_at")
  private LocalDateTime startedAt;

  @Column(name = "ended_at")
  private LocalDateTime endedAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum ABTestStatus {
    DRAFT, RUNNING, COMPLETED, CANCELLED
  }
}
