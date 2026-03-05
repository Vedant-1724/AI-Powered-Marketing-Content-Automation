package com.markai.repository;

import com.markai.model.AnalyticsSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AnalyticsSnapshotRepository extends JpaRepository<AnalyticsSnapshot, Long> {

  List<AnalyticsSnapshot> findByTenantIdAndSnapshotDateBetweenOrderBySnapshotDateAsc(
      String tenantId, LocalDate start, LocalDate end);

  Optional<AnalyticsSnapshot> findByTenantIdAndSnapshotDate(String tenantId, LocalDate date);

  @Query("SELECT a FROM AnalyticsSnapshot a WHERE a.tenantId = :tenantId ORDER BY a.snapshotDate DESC")
  List<AnalyticsSnapshot> findRecentByTenantId(String tenantId, org.springframework.data.domain.Pageable pageable);
}
