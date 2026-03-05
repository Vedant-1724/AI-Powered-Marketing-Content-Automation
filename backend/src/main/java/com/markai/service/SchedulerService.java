package com.markai.service;

import com.markai.dto.SchedulePostRequest;
import com.markai.model.Campaign;
import com.markai.model.ScheduledPost;
import com.markai.model.SocialAccount;
import com.markai.model.User;
import com.markai.repository.CampaignRepository;
import com.markai.repository.ScheduledPostRepository;
import com.markai.repository.SocialAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SchedulerService {

  private static final Logger log = LoggerFactory.getLogger(SchedulerService.class);

  private final ScheduledPostRepository scheduledPostRepository;
  private final CampaignRepository campaignRepository;
  private final SocialAccountRepository socialAccountRepository;
  private final SocialMediaService socialMediaService;

  public SchedulerService(
      ScheduledPostRepository scheduledPostRepository,
      CampaignRepository campaignRepository,
      SocialAccountRepository socialAccountRepository,
      SocialMediaService socialMediaService) {
    this.scheduledPostRepository = scheduledPostRepository;
    this.campaignRepository = campaignRepository;
    this.socialAccountRepository = socialAccountRepository;
    this.socialMediaService = socialMediaService;
  }

  /**
   * Schedule a new post for publishing.
   */
  public ScheduledPost schedulePost(SchedulePostRequest request, User user) {
    ScheduledPost post = ScheduledPost.builder()
        .content(request.getContent())
        .platform(ScheduledPost.Platform.valueOf(request.getPlatform()))
        .scheduledAt(request.getScheduledAt())
        .status(ScheduledPost.PostStatus.PENDING)
        .tenantId(user.getTenantId())
        .user(user)
        .build();

    if (request.getCampaignId() != null) {
      Campaign campaign = campaignRepository.findById(request.getCampaignId())
          .orElse(null);
      post.setCampaign(campaign);
    }

    return scheduledPostRepository.save(post);
  }

  /**
   * Bulk schedule — schedule the same content to multiple platforms.
   */
  public List<ScheduledPost> bulkSchedule(
      String content, List<String> platforms, LocalDateTime scheduledAt, Long campaignId, User user) {

    Campaign campaign = null;
    if (campaignId != null) {
      campaign = campaignRepository.findById(campaignId).orElse(null);
    }

    Campaign finalCampaign = campaign;
    return platforms.stream().map(platform -> {
      ScheduledPost post = ScheduledPost.builder()
          .content(content)
          .platform(ScheduledPost.Platform.valueOf(platform))
          .scheduledAt(scheduledAt)
          .status(ScheduledPost.PostStatus.PENDING)
          .tenantId(user.getTenantId())
          .user(user)
          .campaign(finalCampaign)
          .build();
      return scheduledPostRepository.save(post);
    }).toList();
  }

  /**
   * Get the post queue for a tenant.
   */
  public List<ScheduledPost> getPostQueue(String tenantId) {
    return scheduledPostRepository.findByTenantIdOrderByScheduledAtAsc(tenantId);
  }

  /**
   * Get pending posts.
   */
  public List<ScheduledPost> getPendingPosts(String tenantId) {
    return scheduledPostRepository.findByTenantIdAndStatusOrderByScheduledAtAsc(
        tenantId, ScheduledPost.PostStatus.PENDING);
  }

  /**
   * Cancel a scheduled post.
   */
  public void cancelPost(Long postId) {
    scheduledPostRepository.findById(postId).ifPresent(post -> {
      post.setStatus(ScheduledPost.PostStatus.CANCELLED);
      scheduledPostRepository.save(post);
    });
  }

  /**
   * Reschedule a post.
   */
  public ScheduledPost reschedulePost(Long postId, LocalDateTime newTime) {
    ScheduledPost post = scheduledPostRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("Post not found"));
    post.setScheduledAt(newTime);
    post.setStatus(ScheduledPost.PostStatus.PENDING);
    return scheduledPostRepository.save(post);
  }

  /**
   * Background scheduler — runs every minute to process pending posts.
   * Publishes posts whose scheduled time has arrived.
   */
  @Scheduled(fixedRate = 60000) // Every 60 seconds
  public void processScheduledPosts() {
    LocalDateTime now = LocalDateTime.now();
    List<ScheduledPost> pendingPosts = scheduledPostRepository
        .findByStatusAndScheduledAtBefore(ScheduledPost.PostStatus.PENDING, now);

    for (ScheduledPost post : pendingPosts) {
      try {
        post.setStatus(ScheduledPost.PostStatus.PUBLISHING);
        scheduledPostRepository.save(post);

        // Get the social account token for this platform
        String accessToken = socialAccountRepository
            .findByTenantIdAndPlatform(post.getTenantId(), post.getPlatform())
            .map(SocialAccount::getAccessToken)
            .orElse("demo_token");

        // Publish to the platform
        Map<String, Object> result = socialMediaService.publishToplatform(
            post.getPlatform(), post.getContent(), accessToken);

        if ("published".equals(result.get("status"))) {
          post.setStatus(ScheduledPost.PostStatus.PUBLISHED);
          post.setPublishedAt(LocalDateTime.now());
          post.setExternalPostId((String) result.get("externalPostId"));
          log.info("Post {} published to {} successfully", post.getId(), post.getPlatform());
        } else {
          post.setStatus(ScheduledPost.PostStatus.FAILED);
          post.setErrorMessage((String) result.get("error"));
          log.error("Post {} failed on {}: {}", post.getId(), post.getPlatform(), result.get("error"));
        }

      } catch (Exception e) {
        post.setStatus(ScheduledPost.PostStatus.FAILED);
        post.setErrorMessage(e.getMessage());
        log.error("Failed to process post {}: {}", post.getId(), e.getMessage());
      }

      scheduledPostRepository.save(post);
    }

    if (!pendingPosts.isEmpty()) {
      log.info("Processed {} scheduled posts", pendingPosts.size());
    }
  }

  /**
   * Get publishing queue stats.
   */
  public Map<String, Object> getQueueStats(String tenantId) {
    Map<String, Object> stats = new HashMap<>();
    stats.put("pending", scheduledPostRepository.countByTenantIdAndStatus(tenantId, ScheduledPost.PostStatus.PENDING));
    stats.put("published",
        scheduledPostRepository.countByTenantIdAndStatus(tenantId, ScheduledPost.PostStatus.PUBLISHED));
    stats.put("failed", scheduledPostRepository.countByTenantIdAndStatus(tenantId, ScheduledPost.PostStatus.FAILED));
    stats.put("queued", scheduledPostRepository.countByTenantIdAndStatus(tenantId, ScheduledPost.PostStatus.QUEUED));
    return stats;
  }
}
