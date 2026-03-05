package com.markai.repository;

import com.markai.model.ABTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ABTestRepository extends JpaRepository<ABTest, Long> {
  List<ABTest> findByTenantIdOrderByCreatedAtDesc(String tenantId);

  List<ABTest> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);

  List<ABTest> findByStatus(ABTest.ABTestStatus status);
}
