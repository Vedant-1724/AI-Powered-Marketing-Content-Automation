package com.markai.controller;

import com.markai.dto.EmailCampaignRequest;
import com.markai.model.EmailCampaign;
import com.markai.model.User;
import com.markai.service.EmailCampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

  private final EmailCampaignService emailCampaignService;

  public EmailController(EmailCampaignService emailCampaignService) {
    this.emailCampaignService = emailCampaignService;
  }

  @PostMapping
  public ResponseEntity<EmailCampaign> createEmailCampaign(
      @RequestBody EmailCampaignRequest request,
      @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(emailCampaignService.createEmailCampaign(request, user));
  }

  @GetMapping
  public ResponseEntity<List<EmailCampaign>> getEmailCampaigns(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(emailCampaignService.getEmailCampaigns(user.getTenantId()));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EmailCampaign> getEmailCampaign(@PathVariable Long id) {
    return ResponseEntity.ok(emailCampaignService.getEmailCampaign(id));
  }

  @PostMapping("/{id}/send")
  public ResponseEntity<EmailCampaign> sendEmailCampaign(@PathVariable Long id) {
    return ResponseEntity.ok(emailCampaignService.sendEmailCampaign(id));
  }

  @PutMapping("/{id}/cancel")
  public ResponseEntity<Void> cancelEmailCampaign(@PathVariable Long id) {
    emailCampaignService.cancelEmailCampaign(id);
    return ResponseEntity.noContent().build();
  }
}
