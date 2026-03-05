package com.markai.controller;

import com.markai.dto.AnalyticsDashboard;
import com.markai.model.User;
import com.markai.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

  private final AnalyticsService analyticsService;

  public AnalyticsController(AnalyticsService analyticsService) {
    this.analyticsService = analyticsService;
  }

  @GetMapping("/dashboard")
  public ResponseEntity<AnalyticsDashboard> getDashboard(
      @AuthenticationPrincipal User user,
      @RequestParam(defaultValue = "30") int days) {
    return ResponseEntity.ok(analyticsService.getDashboard(user.getTenantId(), days));
  }
}
