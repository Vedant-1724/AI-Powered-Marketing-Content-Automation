package com.markai.service;

import com.markai.dto.SocialAccountRequest;
import com.markai.model.SocialAccount;
import com.markai.model.ScheduledPost;
import com.markai.model.User;
import com.markai.repository.SocialAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SocialMediaService {

  private static final Logger log = LoggerFactory.getLogger(SocialMediaService.class);
  private final SocialAccountRepository socialAccountRepository;

  public SocialMediaService(SocialAccountRepository socialAccountRepository) {
    this.socialAccountRepository = socialAccountRepository;
  }

  /**
   * Connect a social media account (stores OAuth tokens).
   */
  public SocialAccount connectAccount(SocialAccountRequest request, User user) {
    SocialAccount account = SocialAccount.builder()
        .platform(ScheduledPost.Platform.valueOf(request.getPlatform()))
        .accountName(request.getAccountName())
        .accountId(request.getAccountId())
        .accessToken(request.getAccessToken())
        .refreshToken(request.getRefreshToken())
        .profileImageUrl(request.getProfileImageUrl())
        .isActive(true)
        .tenantId(user.getTenantId())
        .user(user)
        .build();

    return socialAccountRepository.save(account);
  }

  /**
   * Get all connected accounts for a tenant.
   */
  public List<SocialAccount> getConnectedAccounts(String tenantId) {
    return socialAccountRepository.findByTenantIdAndIsActiveTrue(tenantId);
  }

  /**
   * Disconnect a social account.
   */
  public void disconnectAccount(Long accountId) {
    socialAccountRepository.findById(accountId).ifPresent(account -> {
      account.setIsActive(false);
      socialAccountRepository.save(account);
    });
  }

  /**
   * Publish content to a specific platform.
   * In production, this would call the respective platform's API.
   * Currently returns a simulated response.
   */
  public Map<String, Object> publishToplatform(
      ScheduledPost.Platform platform, String content, String accessToken) {
    log.info("Publishing to {}: {} chars", platform, content.length());

    Map<String, Object> result = new HashMap<>();

    switch (platform) {
      case FACEBOOK -> {
        result.put("platform", "FACEBOOK");
        result.put("externalPostId", "fb_" + System.currentTimeMillis());
        result.put("status", "published");
        result.put("url", "https://facebook.com/post/" + System.currentTimeMillis());
        log.info("Facebook post published (simulated)");
      }
      case INSTAGRAM -> {
        result.put("platform", "INSTAGRAM");
        result.put("externalPostId", "ig_" + System.currentTimeMillis());
        result.put("status", "published");
        result.put("url", "https://instagram.com/p/" + System.currentTimeMillis());
        log.info("Instagram post published (simulated)");
      }
      case LINKEDIN -> {
        result.put("platform", "LINKEDIN");
        result.put("externalPostId", "li_" + System.currentTimeMillis());
        result.put("status", "published");
        result.put("url", "https://linkedin.com/post/" + System.currentTimeMillis());
        log.info("LinkedIn post published (simulated)");
      }
      case TWITTER -> {
        result.put("platform", "TWITTER");
        result.put("externalPostId", "tw_" + System.currentTimeMillis());
        result.put("status", "published");
        result.put("url", "https://twitter.com/status/" + System.currentTimeMillis());
        log.info("Twitter post published (simulated)");
      }
      default -> {
        result.put("status", "unsupported");
        result.put("error", "Platform not supported: " + platform);
      }
    }

    return result;
  }

  /**
   * Get the OAuth authorization URL for a platform.
   * In production, this would build the actual OAuth URL.
   */
  public String getAuthorizationUrl(String platform) {
    return switch (platform.toUpperCase()) {
      case "FACEBOOK" ->
        "https://www.facebook.com/v18.0/dialog/oauth?client_id={APP_ID}&redirect_uri={REDIRECT}&scope=pages_manage_posts,pages_read_engagement";
      case "INSTAGRAM" ->
        "https://api.instagram.com/oauth/authorize?client_id={APP_ID}&redirect_uri={REDIRECT}&scope=user_profile,user_media";
      case "LINKEDIN" ->
        "https://www.linkedin.com/oauth/v2/authorization?client_id={APP_ID}&redirect_uri={REDIRECT}&scope=w_member_social";
      case "TWITTER" ->
        "https://twitter.com/i/oauth2/authorize?client_id={APP_ID}&redirect_uri={REDIRECT}&scope=tweet.write";
      default -> throw new RuntimeException("Unsupported platform: " + platform);
    };
  }
}
