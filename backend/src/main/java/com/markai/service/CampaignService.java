package com.markai.service;

import com.markai.dto.CampaignRequest;
import com.markai.dto.DashboardStats;
import com.markai.model.Campaign;
import com.markai.model.User;
import com.markai.repository.CampaignRepository;
import com.markai.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ContentRepository contentRepository;

    public CampaignService(CampaignRepository campaignRepository, ContentRepository contentRepository) {
        this.campaignRepository = campaignRepository;
        this.contentRepository = contentRepository;
    }

    public Campaign createCampaign(CampaignRequest request, User user) {
        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .campaignType(Campaign.CampaignType.valueOf(request.getCampaignType()))
                .content(request.getContent())
                .targetAudience(request.getTargetAudience())
                .platforms(request.getPlatforms())
                .scheduledAt(request.getScheduledAt())
                .status(Campaign.CampaignStatus.DRAFT)
                .tenantId(user.getTenantId())
                .user(user)
                .build();

        return campaignRepository.save(campaign);
    }

    public List<Campaign> getCampaigns(String tenantId) {
        return campaignRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    public Campaign getCampaign(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    public Campaign updateCampaignStatus(Long id, String status) {
        Campaign campaign = getCampaign(id);
        campaign.setStatus(Campaign.CampaignStatus.valueOf(status));
        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }

    public DashboardStats getDashboardStats(User user) {
        String tenantId = user.getTenantId();
        List<Campaign> campaigns = campaignRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);

        long activeCampaigns = campaigns.stream()
                .filter(c -> c.getStatus() == Campaign.CampaignStatus.ACTIVE)
                .count();

        long totalImpressions = campaigns.stream()
                .mapToLong(Campaign::getImpressions)
                .sum();

        long totalClicks = campaigns.stream()
                .mapToLong(Campaign::getClicks)
                .sum();

        double avgCtr = totalImpressions > 0 ? (double) totalClicks / totalImpressions * 100 : 0;

        long totalContent = contentRepository.countByTenantId(tenantId);

        return DashboardStats.builder()
                .totalCampaigns(campaigns.size())
                .activeCampaigns(activeCampaigns)
                .totalContentGenerated(totalContent)
                .totalImpressions(totalImpressions)
                .totalClicks(totalClicks)
                .avgCtr(Math.round(avgCtr * 100.0) / 100.0)
                .subscriptionTier(user.getSubscriptionTier().name())
                .build();
    }
}
