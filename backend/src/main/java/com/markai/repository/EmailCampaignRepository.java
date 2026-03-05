package com.markai.repository;

import com.markai.model.EmailCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, Long> {
  List<EmailCampaign> findByTenantIdOrderByCreatedAtDesc(String tenantId);

  List<EmailCampaign> findByStatusAndScheduledAtBefore(
      EmailCampaign.EmailStatus status, LocalDateTime before);

  long countByTenantId(String tenantId);
}
