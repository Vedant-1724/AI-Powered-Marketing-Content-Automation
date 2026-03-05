package com.markai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PricingResponse {
  private String detectedCountry;
  private String detectedCurrency;
  private String currencySymbol;
  private List<PlanDetail> plans;

  @Data
  @Builder
  public static class PlanDetail {
    private String id;
    private String name;
    private String description;
    private Double monthlyPrice;
    private Double yearlyPrice;
    private Double yearlyMonthly; // yearly price / 12
    private String currency;
    private String currencySymbol;
    private List<String> features;
    private Integer maxContent;
    private Integer maxCampaigns;
    private Integer maxEmails;
    private Integer maxPosts;
    private boolean popular;
  }
}
