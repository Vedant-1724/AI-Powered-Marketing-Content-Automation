package com.markai.service;

import com.markai.dto.EmailCampaignRequest;
import com.markai.model.Campaign;
import com.markai.model.EmailCampaign;
import com.markai.model.User;
import com.markai.repository.CampaignRepository;
import com.markai.repository.EmailCampaignRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmailCampaignService {

  private static final Logger log = LoggerFactory.getLogger(EmailCampaignService.class);

  private final EmailCampaignRepository emailCampaignRepository;
  private final CampaignRepository campaignRepository;

  public EmailCampaignService(
      EmailCampaignRepository emailCampaignRepository,
      CampaignRepository campaignRepository) {
    this.emailCampaignRepository = emailCampaignRepository;
    this.campaignRepository = campaignRepository;
  }

  /**
   * Create a new email campaign.
   */
  public EmailCampaign createEmailCampaign(EmailCampaignRequest request, User user) {
    EmailCampaign email = EmailCampaign.builder()
        .name(request.getName())
        .subjectLine(request.getSubjectLine())
        .previewText(request.getPreviewText())
        .htmlContent(request.getHtmlContent())
        .plainTextContent(request.getPlainTextContent())
        .fromName(request.getFromName())
        .fromEmail(request.getFromEmail())
        .replyTo(request.getReplyTo())
        .recipientList(request.getRecipientList())
        .scheduledAt(request.getScheduledAt())
        .status(request.getScheduledAt() != null
            ? EmailCampaign.EmailStatus.SCHEDULED
            : EmailCampaign.EmailStatus.DRAFT)
        .tenantId(user.getTenantId())
        .user(user)
        .build();

    // Count recipients
    if (request.getRecipientList() != null) {
      String[] recipients = request.getRecipientList()
          .replace("[", "").replace("]", "").replace("\"", "")
          .split(",");
      email.setRecipientCount(recipients.length);
    }

    // Link to parent campaign if provided
    if (request.getCampaignId() != null) {
      Campaign campaign = campaignRepository.findById(request.getCampaignId()).orElse(null);
      email.setCampaign(campaign);
    }

    return emailCampaignRepository.save(email);
  }

  /**
   * Get all email campaigns for a tenant.
   */
  public List<EmailCampaign> getEmailCampaigns(String tenantId) {
    return emailCampaignRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
  }

  /**
   * Get a single email campaign.
   */
  public EmailCampaign getEmailCampaign(Long id) {
    return emailCampaignRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Email campaign not found"));
  }

  /**
   * Send an email campaign immediately.
   * In production, this would integrate with SendGrid, AWS SES, or Mailgun.
   */
  public EmailCampaign sendEmailCampaign(Long id) {
    EmailCampaign email = getEmailCampaign(id);
    email.setStatus(EmailCampaign.EmailStatus.SENDING);
    emailCampaignRepository.save(email);

    try {
      // Simulate sending emails
      log.info("Sending email campaign '{}' to {} recipients",
          email.getName(), email.getRecipientCount());

      // In production: iterate over recipients and send via email provider
      // For now, simulate successful send
      email.setSent(email.getRecipientCount());
      email.setDelivered((int) (email.getRecipientCount() * 0.97)); // ~97% delivery rate
      email.setStatus(EmailCampaign.EmailStatus.SENT);
      email.setSentAt(LocalDateTime.now());

      // Simulate analytics (in production, these come from webhooks)
      email.setOpened((int) (email.getDelivered() * 0.28)); // ~28% open rate
      email.setClicked((int) (email.getOpened() * 0.12)); // ~12% click rate
      email.setBounced(email.getSent() - email.getDelivered());
      email.setOpenRate(email.getDelivered() > 0
          ? Math.round((double) email.getOpened() / email.getDelivered() * 10000.0) / 100.0
          : 0.0);
      email.setClickRate(email.getOpened() > 0
          ? Math.round((double) email.getClicked() / email.getOpened() * 10000.0) / 100.0
          : 0.0);

      log.info("Email campaign '{}' sent successfully: {} delivered, {}% open rate",
          email.getName(), email.getDelivered(), email.getOpenRate());

    } catch (Exception e) {
      email.setStatus(EmailCampaign.EmailStatus.FAILED);
      log.error("Failed to send email campaign '{}': {}", email.getName(), e.getMessage());
    }

    return emailCampaignRepository.save(email);
  }

  /**
   * Background scheduler — processes scheduled email campaigns.
   */
  @Scheduled(fixedRate = 60000)
  public void processScheduledEmails() {
    LocalDateTime now = LocalDateTime.now();
    List<EmailCampaign> scheduled = emailCampaignRepository
        .findByStatusAndScheduledAtBefore(EmailCampaign.EmailStatus.SCHEDULED, now);

    for (EmailCampaign email : scheduled) {
      sendEmailCampaign(email.getId());
    }

    if (!scheduled.isEmpty()) {
      log.info("Processed {} scheduled email campaigns", scheduled.size());
    }
  }

  /**
   * Cancel a scheduled email campaign.
   */
  public void cancelEmailCampaign(Long id) {
    EmailCampaign email = getEmailCampaign(id);
    email.setStatus(EmailCampaign.EmailStatus.CANCELLED);
    emailCampaignRepository.save(email);
  }
}
