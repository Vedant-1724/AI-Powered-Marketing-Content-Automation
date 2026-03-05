package com.markai.dto;

import lombok.Data;

@Data
public class SocialAccountRequest {
  private String platform;
  private String accountName;
  private String accountId;
  private String accessToken;
  private String refreshToken;
  private String profileImageUrl;
}
