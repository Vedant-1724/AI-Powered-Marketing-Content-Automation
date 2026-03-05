package com.markai.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EmailCampaignRequest {
  private String name;
  private String subjectLine;
  private String previewText;
  private String htmlContent;
  private String plainTextContent;
  private String fromName;
  private String fromEmail;
  private String replyTo;
  private String recipientList; // JSON array of emails
  private Long campaignId;
  private LocalDateTime scheduledAt;
}
