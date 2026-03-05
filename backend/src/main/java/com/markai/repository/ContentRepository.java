package com.markai.repository;

import com.markai.model.GeneratedContent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentRepository extends JpaRepository<GeneratedContent, Long> {
    List<GeneratedContent> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    List<GeneratedContent> findByTenantIdAndIsFavoriteTrue(String tenantId);
    long countByTenantId(String tenantId);
}
