package com.markai.service;

import com.markai.dto.ABTestRequest;
import com.markai.model.ABTest;
import com.markai.model.Campaign;
import com.markai.model.User;
import com.markai.repository.ABTestRepository;
import com.markai.repository.CampaignRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ABTestService {

  private static final Logger log = LoggerFactory.getLogger(ABTestService.class);

  private final ABTestRepository abTestRepository;
  private final CampaignRepository campaignRepository;

  public ABTestService(ABTestRepository abTestRepository, CampaignRepository campaignRepository) {
    this.abTestRepository = abTestRepository;
    this.campaignRepository = campaignRepository;
  }

  /**
   * Create a new A/B test.
   */
  public ABTest createTest(ABTestRequest request, User user) {
    Campaign campaign = campaignRepository.findById(request.getCampaignId())
        .orElseThrow(() -> new RuntimeException("Campaign not found"));

    ABTest test = ABTest.builder()
        .name(request.getName())
        .campaign(campaign)
        .variantAContent(request.getVariantAContent())
        .variantASubject(request.getVariantASubject())
        .variantBContent(request.getVariantBContent())
        .variantBSubject(request.getVariantBSubject())
        .splitPercentage(request.getSplitPercentage() != null ? request.getSplitPercentage() : 50)
        .status(ABTest.ABTestStatus.DRAFT)
        .tenantId(user.getTenantId())
        .build();

    return abTestRepository.save(test);
  }

  /**
   * Start an A/B test.
   */
  public ABTest startTest(Long testId) {
    ABTest test = abTestRepository.findById(testId)
        .orElseThrow(() -> new RuntimeException("A/B test not found"));

    test.setStatus(ABTest.ABTestStatus.RUNNING);
    test.setStartedAt(LocalDateTime.now());

    // Simulate initial traffic distribution
    simulateResults(test);

    return abTestRepository.save(test);
  }

  /**
   * Get all A/B tests for a tenant.
   */
  public List<ABTest> getTests(String tenantId) {
    return abTestRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
  }

  /**
   * Get A/B test details with computed winner.
   */
  public Map<String, Object> getTestResults(Long testId) {
    ABTest test = abTestRepository.findById(testId)
        .orElseThrow(() -> new RuntimeException("A/B test not found"));

    Map<String, Object> results = new HashMap<>();
    results.put("test", test);

    // Calculate CTRs
    double ctrA = test.getVariantAImpressions() > 0
        ? (double) test.getVariantAClicks() / test.getVariantAImpressions() * 100
        : 0;
    double ctrB = test.getVariantBImpressions() > 0
        ? (double) test.getVariantBClicks() / test.getVariantBImpressions() * 100
        : 0;

    results.put("ctrA", Math.round(ctrA * 100.0) / 100.0);
    results.put("ctrB", Math.round(ctrB * 100.0) / 100.0);

    // Conversion rates
    double convA = test.getVariantAClicks() > 0
        ? (double) test.getVariantAConversions() / test.getVariantAClicks() * 100
        : 0;
    double convB = test.getVariantBClicks() > 0
        ? (double) test.getVariantBConversions() / test.getVariantBClicks() * 100
        : 0;

    results.put("conversionRateA", Math.round(convA * 100.0) / 100.0);
    results.put("conversionRateB", Math.round(convB * 100.0) / 100.0);

    // Determine winner
    String winner = null;
    double confidence = 0;
    if (test.getVariantAImpressions() > 100 && test.getVariantBImpressions() > 100) {
      confidence = calculateConfidence(
          test.getVariantAClicks(), test.getVariantAImpressions(),
          test.getVariantBClicks(), test.getVariantBImpressions());
      if (confidence >= 95) {
        winner = ctrA > ctrB ? "A" : "B";
      }
    }

    results.put("winner", winner);
    results.put("confidenceLevel", Math.round(confidence * 100.0) / 100.0);
    results.put("recommendation", getRecommendation(ctrA, ctrB, confidence, winner));

    return results;
  }

  /**
   * End an A/B test and declare the winner.
   */
  public ABTest endTest(Long testId) {
    ABTest test = abTestRepository.findById(testId)
        .orElseThrow(() -> new RuntimeException("A/B test not found"));

    double ctrA = test.getVariantAImpressions() > 0
        ? (double) test.getVariantAClicks() / test.getVariantAImpressions() * 100
        : 0;
    double ctrB = test.getVariantBImpressions() > 0
        ? (double) test.getVariantBClicks() / test.getVariantBImpressions() * 100
        : 0;

    double confidence = calculateConfidence(
        test.getVariantAClicks(), test.getVariantAImpressions(),
        test.getVariantBClicks(), test.getVariantBImpressions());

    test.setStatus(ABTest.ABTestStatus.COMPLETED);
    test.setEndedAt(LocalDateTime.now());
    test.setConfidenceLevel(confidence);
    test.setWinner(ctrA >= ctrB ? "A" : "B");

    log.info("A/B test '{}' completed. Winner: Variant {} (CTR: A={}%, B={}%, Confidence: {}%)",
        test.getName(), test.getWinner(), Math.round(ctrA * 100.0) / 100.0,
        Math.round(ctrB * 100.0) / 100.0, Math.round(confidence * 100.0) / 100.0);

    return abTestRepository.save(test);
  }

  /**
   * Simulate A/B test results (for demo mode).
   * In production, results come from actual user interactions.
   */
  private void simulateResults(ABTest test) {
    int baseImpressions = 500 + (int) (Math.random() * 1500);

    // Variant A
    test.setVariantAImpressions(baseImpressions);
    double rateA = 0.05 + Math.random() * 0.10; // 5-15% CTR
    test.setVariantAClicks((int) (baseImpressions * rateA));
    test.setVariantAConversions((int) (test.getVariantAClicks() * (0.02 + Math.random() * 0.08)));

    // Variant B
    test.setVariantBImpressions(baseImpressions);
    double rateB = 0.05 + Math.random() * 0.10;
    test.setVariantBClicks((int) (baseImpressions * rateB));
    test.setVariantBConversions((int) (test.getVariantBClicks() * (0.02 + Math.random() * 0.08)));
  }

  /**
   * Calculate statistical confidence using a simplified Z-test.
   */
  private double calculateConfidence(int clicksA, int impressionsA, int clicksB, int impressionsB) {
    if (impressionsA == 0 || impressionsB == 0)
      return 0;

    double pA = (double) clicksA / impressionsA;
    double pB = (double) clicksB / impressionsB;
    double pPooled = (double) (clicksA + clicksB) / (impressionsA + impressionsB);

    double se = Math.sqrt(pPooled * (1 - pPooled) * (1.0 / impressionsA + 1.0 / impressionsB));
    if (se == 0)
      return 0;

    double z = Math.abs(pA - pB) / se;

    // Map z-score to confidence (simplified)
    if (z >= 2.576)
      return 99.0;
    if (z >= 1.96)
      return 95.0;
    if (z >= 1.645)
      return 90.0;
    if (z >= 1.28)
      return 80.0;
    return Math.min(z / 1.96 * 95.0, 79.0);
  }

  private String getRecommendation(double ctrA, double ctrB, double confidence, String winner) {
    if (winner == null) {
      if (confidence > 80) {
        return "Results are trending but not yet statistically significant. Continue running the test.";
      }
      return "Not enough data to determine a winner. Keep the test running for more reliable results.";
    }

    double lift = winner.equals("A")
        ? ((ctrA - ctrB) / ctrB * 100)
        : ((ctrB - ctrA) / ctrA * 100);

    return String.format("Variant %s is the winner with %.1f%% higher CTR (%.1f%% confidence). " +
        "Recommend deploying Variant %s for the full campaign.", winner, lift, confidence, winner);
  }

  /**
   * Background job to auto-complete tests that have been running too long (7
   * days).
   */
  @Scheduled(fixedRate = 3600000) // Every hour
  public void autoCompleteTests() {
    List<ABTest> running = abTestRepository.findByStatus(ABTest.ABTestStatus.RUNNING);
    LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

    for (ABTest test : running) {
      if (test.getStartedAt() != null && test.getStartedAt().isBefore(cutoff)) {
        endTest(test.getId());
        log.info("Auto-completed A/B test '{}' after 7 days", test.getName());
      }
    }
  }
}
