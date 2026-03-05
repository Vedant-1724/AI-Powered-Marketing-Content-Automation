package com.markai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "email_campaigns")
public class EmailCampaign {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(name = "subject_line", nullable = false)
  private String subjectLine;

  @Column(name = "preview_text")
  private String previewText;

  @Column(name = "html_content", columnDefinition = "TEXT", nullable = false)
  private String htmlContent;

  @Column(name = "plain_text_content", columnDefinition = "TEXT")
  private String plainTextContent;

  @Column(name = "from_name")
  private String fromName;

  @Column(name = "from_email")
  private String fromEmail;

  @Column(name = "reply_to")
  private String replyTo;

  @Column(name = "recipient_list", columnDefinition = "TEXT")
  private String recipientList; // JSON array of emails

  @Column(name = "recipient_count")
  @Builder.Default
  private Integer recipientCount = 0;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private EmailStatus status = EmailStatus.DRAFT;

  @Column(name = "scheduled_at")
  private LocalDateTime scheduledAt;

  @Column(name = "sent_at")
  private LocalDateTime sentAt;

  // Analytics
  @Builder.Default
  private Integer sent = 0;
  @Builder.Default
  private Integer delivered = 0;
  @Builder.Default
  private Integer opened = 0;
  @Builder.Default
  private Integer clicked = 0;
  @Builder.Default
  private Integer bounced = 0;
  @Builder.Default
  private Integer unsubscribed = 0;

  @Column(name = "open_rate")
  @Builder.Default
  private Double openRate = 0.0;

  @Column(name = "click_rate")
  @Builder.Default
  private Double clickRate = 0.0;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "campaign_id")
  private Campaign campaign;

  @Column(name = "tenant_id", nullable = false)
  private String tenantId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum EmailStatus {
    DRAFT, SCHEDULED, SENDING, SENT, FAILED, CANCELLED
  }
}
