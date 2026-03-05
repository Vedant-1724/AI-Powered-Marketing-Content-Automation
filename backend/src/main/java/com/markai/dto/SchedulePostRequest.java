package com.markai.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SchedulePostRequest {
  private Long campaignId;
  private String content;
  private String platform; // FACEBOOK, INSTAGRAM, LINKEDIN, TWITTER, EMAIL
  private LocalDateTime scheduledAt;
}
