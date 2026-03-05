package com.markai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalCampaigns;
    private long activeCampaigns;
    private long totalContentGenerated;
    private long totalImpressions;
    private long totalClicks;
    private double avgCtr;
    private String subscriptionTier;
}
