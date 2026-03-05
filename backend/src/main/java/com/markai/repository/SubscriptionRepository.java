package com.markai.repository;

import com.markai.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
  Optional<Subscription> findByTenantId(String tenantId);

  Optional<Subscription> findByRazorpaySubscriptionId(String razorpaySubscriptionId);
}
