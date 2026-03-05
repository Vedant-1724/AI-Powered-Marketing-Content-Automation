package com.markai.repository;

import com.markai.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    List<Campaign> findByTenantIdAndStatus(String tenantId, Campaign.CampaignStatus status);
    long countByTenantId(String tenantId);
}
