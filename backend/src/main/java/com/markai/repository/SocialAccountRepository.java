package com.markai.repository;

import com.markai.model.SocialAccount;
import com.markai.model.ScheduledPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
  List<SocialAccount> findByTenantIdAndIsActiveTrue(String tenantId);

  Optional<SocialAccount> findByTenantIdAndPlatform(
      String tenantId, ScheduledPost.Platform platform);

  long countByTenantId(String tenantId);
}
