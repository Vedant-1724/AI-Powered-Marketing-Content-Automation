package com.markai.repository;

import com.markai.model.ScheduledPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ScheduledPostRepository extends JpaRepository<ScheduledPost, Long> {
  List<ScheduledPost> findByTenantIdOrderByScheduledAtAsc(String tenantId);

  List<ScheduledPost> findByStatusAndScheduledAtBefore(
      ScheduledPost.PostStatus status, LocalDateTime before);

  List<ScheduledPost> findByTenantIdAndStatusOrderByScheduledAtAsc(
      String tenantId, ScheduledPost.PostStatus status);

  List<ScheduledPost> findByCampaignIdOrderByScheduledAtAsc(Long campaignId);

  long countByTenantIdAndStatus(String tenantId, ScheduledPost.PostStatus status);
}
