package com.markai.dto;

import lombok.Data;

@Data
public class ABTestRequest {
  private String name;
  private Long campaignId;
  private String variantAContent;
  private String variantASubject;
  private String variantBContent;
  private String variantBSubject;
  private Integer splitPercentage; // default 50
}
