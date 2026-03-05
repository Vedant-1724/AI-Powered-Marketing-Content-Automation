package com.markai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsDashboard {
  // Overview KPIs
  private Long totalImpressions;
  private Long totalClicks;
  private Long totalConversions;
  private Double overallCtr;
  private Double conversionRate;
  private Double estimatedRevenue;

  // Trends (last 30 days)
  private List<DailyMetric> impressionsTrend;
  private List<DailyMetric> clicksTrend;
  private List<DailyMetric> ctrTrend;

  // Channel breakdown
  private Map<String, ChannelStats> channelBreakdown;

  // Top performing campaigns
  private List<CampaignPerformance> topCampaigns;

  // AI insights
  private List<String> aiInsights;
  private List<String> recommendations;

  // Send-time optimization
  private Map<String, Double> bestSendTimes;

  @Data
  @Builder
  public static class DailyMetric {
    private String date;
    private Long value;
    private Double change; // % change from previous day
  }

  @Data
  @Builder
  public static class ChannelStats {
    private String channel;
    private Long impressions;
    private Long clicks;
    private Double ctr;
    private Integer campaigns;
  }

  @Data
  @Builder
  public static class CampaignPerformance {
    private Long id;
    private String name;
    private String type;
    private String status;
    private Long impressions;
    private Long clicks;
    private Double ctr;
    private Integer conversions;
    private Double score; // AI performance score
  }
}
