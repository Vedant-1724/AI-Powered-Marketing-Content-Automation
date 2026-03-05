package com.markai.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CampaignRequest {
    private String name;
    private String description;
    private String campaignType;
    private String content;
    private String targetAudience;
    private String platforms;
    private LocalDateTime scheduledAt;
}
