package com.markai.controller;

import com.markai.dto.SchedulePostRequest;
import com.markai.dto.SocialAccountRequest;
import com.markai.model.ScheduledPost;
import com.markai.model.SocialAccount;
import com.markai.model.User;
import com.markai.service.SchedulerService;
import com.markai.service.SocialMediaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social")
public class SocialController {

  private final SocialMediaService socialMediaService;
  private final SchedulerService schedulerService;

  public SocialController(SocialMediaService socialMediaService, SchedulerService schedulerService) {
    this.socialMediaService = socialMediaService;
    this.schedulerService = schedulerService;
  }

  // ─── Social Accounts ───────────────────────────────────────

  @PostMapping("/accounts/connect")
  public ResponseEntity<SocialAccount> connectAccount(
      @RequestBody SocialAccountRequest request,
      @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(socialMediaService.connectAccount(request, user));
  }

  @GetMapping("/accounts")
  public ResponseEntity<List<SocialAccount>> getAccounts(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(socialMediaService.getConnectedAccounts(user.getTenantId()));
  }

  @DeleteMapping("/accounts/{id}")
  public ResponseEntity<Void> disconnectAccount(@PathVariable Long id) {
    socialMediaService.disconnectAccount(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/auth-url/{platform}")
  public ResponseEntity<Map<String, String>> getAuthUrl(@PathVariable String platform) {
    String url = socialMediaService.getAuthorizationUrl(platform);
    return ResponseEntity.ok(Map.of("authorizationUrl", url, "platform", platform));
  }

  // ─── Post Scheduling ───────────────────────────────────────

  @PostMapping("/schedule")
  public ResponseEntity<ScheduledPost> schedulePost(
      @RequestBody SchedulePostRequest request,
      @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(schedulerService.schedulePost(request, user));
  }

  @PostMapping("/schedule/bulk")
  public ResponseEntity<List<ScheduledPost>> bulkSchedule(
      @RequestBody Map<String, Object> body,
      @AuthenticationPrincipal User user) {
    String content = (String) body.get("content");
    @SuppressWarnings("unchecked")
    List<String> platforms = (List<String>) body.get("platforms");
    String scheduledStr = (String) body.get("scheduledAt");
    LocalDateTime scheduledAt = LocalDateTime.parse(scheduledStr);
    Long campaignId = body.get("campaignId") != null
        ? Long.valueOf(body.get("campaignId").toString())
        : null;

    return ResponseEntity.ok(schedulerService.bulkSchedule(
        content, platforms, scheduledAt, campaignId, user));
  }

  @GetMapping("/queue")
  public ResponseEntity<List<ScheduledPost>> getQueue(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(schedulerService.getPostQueue(user.getTenantId()));
  }

  @GetMapping("/queue/pending")
  public ResponseEntity<List<ScheduledPost>> getPending(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(schedulerService.getPendingPosts(user.getTenantId()));
  }

  @GetMapping("/queue/stats")
  public ResponseEntity<Map<String, Object>> getQueueStats(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(schedulerService.getQueueStats(user.getTenantId()));
  }

  @PutMapping("/queue/{id}/cancel")
  public ResponseEntity<Void> cancelPost(@PathVariable Long id) {
    schedulerService.cancelPost(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/queue/{id}/reschedule")
  public ResponseEntity<ScheduledPost> reschedulePost(
      @PathVariable Long id, @RequestBody Map<String, String> body) {
    LocalDateTime newTime = LocalDateTime.parse(body.get("scheduledAt"));
    return ResponseEntity.ok(schedulerService.reschedulePost(id, newTime));
  }
}
