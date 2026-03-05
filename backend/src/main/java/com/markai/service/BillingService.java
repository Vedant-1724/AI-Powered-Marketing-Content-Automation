package com.markai.service;

import com.markai.dto.PricingResponse;
import com.markai.dto.PricingResponse.PlanDetail;
import com.markai.model.Subscription;
import com.markai.model.Subscription.*;
import com.markai.model.User;
import com.markai.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BillingService {

  private static final Logger log = LoggerFactory.getLogger(BillingService.class);
  private final SubscriptionRepository subscriptionRepository;

  // Currency conversion rates (from USD)
  private static final Map<String, Double> CURRENCY_RATES = Map.ofEntries(
      Map.entry("USD", 1.0), Map.entry("EUR", 0.92), Map.entry("GBP", 0.79),
      Map.entry("INR", 83.50), Map.entry("CAD", 1.36), Map.entry("AUD", 1.53),
      Map.entry("JPY", 149.50), Map.entry("CNY", 7.24), Map.entry("BRL", 4.97),
      Map.entry("MXN", 17.15), Map.entry("SGD", 1.34), Map.entry("AED", 3.67),
      Map.entry("ZAR", 18.60), Map.entry("KRW", 1320.0), Map.entry("THB", 35.50),
      Map.entry("IDR", 15600.0), Map.entry("PHP", 56.20), Map.entry("MYR", 4.72),
      Map.entry("SAR", 3.75), Map.entry("NGN", 1550.0));

  private static final Map<String, String> CURRENCY_SYMBOLS = Map.ofEntries(
      Map.entry("USD", "$"), Map.entry("EUR", "€"), Map.entry("GBP", "£"),
      Map.entry("INR", "₹"), Map.entry("CAD", "C$"), Map.entry("AUD", "A$"),
      Map.entry("JPY", "¥"), Map.entry("CNY", "¥"), Map.entry("BRL", "R$"),
      Map.entry("MXN", "MX$"), Map.entry("SGD", "S$"), Map.entry("AED", "د.إ"),
      Map.entry("ZAR", "R"), Map.entry("KRW", "₩"), Map.entry("THB", "฿"),
      Map.entry("IDR", "Rp"), Map.entry("PHP", "₱"), Map.entry("MYR", "RM"),
      Map.entry("SAR", "﷼"), Map.entry("NGN", "₦"));

  // Country → Currency mapping
  private static final Map<String, String> COUNTRY_CURRENCY = Map.ofEntries(
      Map.entry("US", "USD"), Map.entry("GB", "GBP"), Map.entry("IN", "INR"),
      Map.entry("CA", "CAD"), Map.entry("AU", "AUD"), Map.entry("JP", "JPY"),
      Map.entry("CN", "CNY"), Map.entry("BR", "BRL"), Map.entry("MX", "MXN"),
      Map.entry("SG", "SGD"), Map.entry("AE", "AED"), Map.entry("ZA", "ZAR"),
      Map.entry("KR", "KRW"), Map.entry("TH", "THB"), Map.entry("ID", "IDR"),
      Map.entry("PH", "PHP"), Map.entry("MY", "MYR"), Map.entry("SA", "SAR"),
      Map.entry("NG", "NGN"), Map.entry("DE", "EUR"), Map.entry("FR", "EUR"),
      Map.entry("IT", "EUR"), Map.entry("ES", "EUR"), Map.entry("NL", "EUR"),
      Map.entry("BE", "EUR"), Map.entry("AT", "EUR"), Map.entry("IE", "EUR"),
      Map.entry("PT", "EUR"), Map.entry("FI", "EUR"));

  // Base prices in USD
  private static final Map<String, Double> PLAN_MONTHLY_USD = Map.of(
      "FREE", 0.0, "STARTER", 19.0, "PROFESSIONAL", 49.0, "ENTERPRISE", 129.0);
  private static final Map<String, Double> PLAN_YEARLY_USD = Map.of(
      "FREE", 0.0, "STARTER", 190.0, "PROFESSIONAL", 490.0, "ENTERPRISE", 1290.0);

  public BillingService(SubscriptionRepository subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  /**
   * Detect currency based on country code.
   */
  public String detectCurrency(String countryCode) {
    return COUNTRY_CURRENCY.getOrDefault(countryCode.toUpperCase(), "USD");
  }

  /**
   * Convert USD price to local currency.
   */
  public double convertPrice(double usdPrice, String currency) {
    double rate = CURRENCY_RATES.getOrDefault(currency, 1.0);
    double converted = usdPrice * rate;
    // Round nicely based on currency
    if (rate > 100)
      return Math.round(converted / 10.0) * 10; // Round to 10s for JPY, INR, etc.
    return Math.round(converted * 100.0) / 100.0;
  }

  /**
   * Get full pricing for a country.
   */
  public PricingResponse getPricing(String countryCode) {
    String currency = detectCurrency(countryCode);
    String symbol = CURRENCY_SYMBOLS.getOrDefault(currency, "$");

    List<PlanDetail> plans = List.of(
        buildPlan("FREE", "Free", "Get started with basic features", currency, symbol,
            List.of("10 AI content generations/mo", "3 campaigns", "100 emails/mo",
                "10 scheduled posts", "Basic analytics", "Community support"),
            10, 3, 100, 10, false),
        buildPlan("STARTER", "Starter", "Perfect for small businesses", currency, symbol,
            List.of("100 AI content generations/mo", "15 campaigns", "1,000 emails/mo",
                "50 scheduled posts", "Advanced analytics", "A/B testing",
                "Social media integration", "Email support"),
            100, 15, 1000, 50, false),
        buildPlan("PROFESSIONAL", "Professional", "For growing teams", currency, symbol,
            List.of("Unlimited AI content", "Unlimited campaigns", "10,000 emails/mo",
                "Unlimited scheduled posts", "AI optimizer & CTR prediction",
                "Smart send-time optimization", "Custom brand voice (RAG)",
                "Priority support", "API access"),
            -1, -1, 10000, -1, true),
        buildPlan("ENTERPRISE", "Enterprise", "Full-scale marketing ops", currency, symbol,
            List.of("Everything in Professional", "50,000 emails/mo", "Dedicated account manager",
                "Custom AI model training", "White-label options", "SSO & SAML",
                "SLA guarantee", "24/7 phone support", "Custom integrations"),
            -1, -1, 50000, -1, false));

    return PricingResponse.builder()
        .detectedCountry(countryCode.toUpperCase())
        .detectedCurrency(currency)
        .currencySymbol(symbol)
        .plans(plans)
        .build();
  }

  private PlanDetail buildPlan(String id, String name, String desc, String currency, String symbol,
      List<String> features, int maxContent, int maxCampaigns, int maxEmails, int maxPosts, boolean popular) {
    double monthlyUsd = PLAN_MONTHLY_USD.getOrDefault(id, 0.0);
    double yearlyUsd = PLAN_YEARLY_USD.getOrDefault(id, 0.0);

    return PlanDetail.builder()
        .id(id)
        .name(name)
        .description(desc)
        .monthlyPrice(convertPrice(monthlyUsd, currency))
        .yearlyPrice(convertPrice(yearlyUsd, currency))
        .yearlyMonthly(yearlyUsd > 0 ? convertPrice(yearlyUsd / 12.0, currency) : 0)
        .currency(currency)
        .currencySymbol(symbol)
        .features(features)
        .maxContent(maxContent)
        .maxCampaigns(maxCampaigns)
        .maxEmails(maxEmails)
        .maxPosts(maxPosts)
        .popular(popular)
        .build();
  }

  /**
   * Get or create a subscription for a tenant.
   */
  public Subscription getSubscription(String tenantId, User user) {
    return subscriptionRepository.findByTenantId(tenantId)
        .orElseGet(() -> {
          Subscription sub = Subscription.builder()
              .tenantId(tenantId)
              .user(user)
              .plan(SubscriptionPlan.FREE)
              .status(SubscriptionStatus.ACTIVE)
              .maxContentGenerations(10)
              .maxCampaigns(3)
              .maxEmailsPerMonth(100)
              .maxScheduledPosts(10)
              .currentPeriodStart(LocalDateTime.now())
              .currentPeriodEnd(LocalDateTime.now().plusMonths(1))
              .build();
          return subscriptionRepository.save(sub);
        });
  }

  /**
   * Create a Razorpay checkout session (simulated).
   * In production, this calls the Razorpay API.
   */
  public Map<String, Object> createCheckout(String tenantId, String planId, String countryCode, boolean yearly) {
    String currency = detectCurrency(countryCode);
    double usdPrice = yearly ? PLAN_YEARLY_USD.getOrDefault(planId, 0.0) : PLAN_MONTHLY_USD.getOrDefault(planId, 0.0);
    double localPrice = convertPrice(usdPrice, currency);

    // In production: Create Razorpay order via API
    // RazorpayClient client = new RazorpayClient(key, secret);
    // JSONObject options = new JSONObject();
    // options.put("amount", (int)(localPrice * 100)); // paise
    // options.put("currency", currency);
    // Order order = client.orders.create(options);

    Map<String, Object> checkout = new HashMap<>();
    checkout.put("orderId", "order_" + System.currentTimeMillis());
    checkout.put("amount", (int) (localPrice * 100)); // Razorpay uses smallest unit
    checkout.put("currency", currency);
    checkout.put("currencySymbol", CURRENCY_SYMBOLS.getOrDefault(currency, "$"));
    checkout.put("displayAmount", localPrice);
    checkout.put("plan", planId);
    checkout.put("billing", yearly ? "yearly" : "monthly");
    checkout.put("razorpayKeyId", "rzp_test_demo_key"); // Replace with real key
    checkout.put("businessName", "MarkAI");
    checkout.put("description", (yearly ? "Annual" : "Monthly") + " " + planId + " Plan");

    log.info("Checkout created for tenant {} — {} {} {} ({})",
        tenantId, planId, localPrice, currency, yearly ? "yearly" : "monthly");

    return checkout;
  }

  /**
   * Confirm payment and activate subscription (called after Razorpay callback).
   */
  public Subscription activateSubscription(String tenantId, String planId, String razorpayPaymentId,
      String razorpayOrderId, String countryCode, boolean yearly) {
    Subscription sub = subscriptionRepository.findByTenantId(tenantId)
        .orElseThrow(() -> new RuntimeException("Subscription not found"));

    SubscriptionPlan plan = SubscriptionPlan.valueOf(planId);
    String currency = detectCurrency(countryCode);

    sub.setPlan(plan);
    sub.setStatus(SubscriptionStatus.ACTIVE);
    sub.setCountry(countryCode);
    sub.setCurrency(currency);
    sub.setRazorpaySubscriptionId(razorpayPaymentId);
    sub.setCurrentPeriodStart(LocalDateTime.now());
    sub.setCurrentPeriodEnd(yearly ? LocalDateTime.now().plusYears(1) : LocalDateTime.now().plusMonths(1));

    // Set limits based on plan
    switch (plan) {
      case STARTER -> {
        sub.setMaxContentGenerations(100);
        sub.setMaxCampaigns(15);
        sub.setMaxEmailsPerMonth(1000);
        sub.setMaxScheduledPosts(50);
      }
      case PROFESSIONAL -> {
        sub.setMaxContentGenerations(Integer.MAX_VALUE);
        sub.setMaxCampaigns(Integer.MAX_VALUE);
        sub.setMaxEmailsPerMonth(10000);
        sub.setMaxScheduledPosts(Integer.MAX_VALUE);
      }
      case ENTERPRISE -> {
        sub.setMaxContentGenerations(Integer.MAX_VALUE);
        sub.setMaxCampaigns(Integer.MAX_VALUE);
        sub.setMaxEmailsPerMonth(50000);
        sub.setMaxScheduledPosts(Integer.MAX_VALUE);
      }
      default -> {
        sub.setMaxContentGenerations(10);
        sub.setMaxCampaigns(3);
        sub.setMaxEmailsPerMonth(100);
        sub.setMaxScheduledPosts(10);
      }
    }

    double usdPrice = yearly ? PLAN_YEARLY_USD.getOrDefault(planId, 0.0) : PLAN_MONTHLY_USD.getOrDefault(planId, 0.0);
    sub.setAmount(convertPrice(usdPrice, currency));

    log.info("Subscription activated: tenant={}, plan={}, amount={} {}", tenantId, plan, sub.getAmount(), currency);

    return subscriptionRepository.save(sub);
  }

  /**
   * Cancel a subscription.
   */
  public Subscription cancelSubscription(String tenantId) {
    Subscription sub = subscriptionRepository.findByTenantId(tenantId)
        .orElseThrow(() -> new RuntimeException("Subscription not found"));
    sub.setStatus(SubscriptionStatus.CANCELLED);
    sub.setCancelledAt(LocalDateTime.now());
    log.info("Subscription cancelled for tenant {}", tenantId);
    return subscriptionRepository.save(sub);
  }

  /**
   * Check if a user has exceeded their plan limits.
   */
  public Map<String, Object> getUsage(String tenantId) {
    Subscription sub = subscriptionRepository.findByTenantId(tenantId)
        .orElse(Subscription.builder().plan(SubscriptionPlan.FREE).build());

    Map<String, Object> usage = new LinkedHashMap<>();
    usage.put("plan", sub.getPlan().name());
    usage.put("status", sub.getStatus().name());
    usage.put("contentGenerations",
        Map.of("used", sub.getContentGenerations(), "limit", sub.getMaxContentGenerations()));
    usage.put("campaigns", Map.of("used", sub.getCampaignsCreated(), "limit", sub.getMaxCampaigns()));
    usage.put("emails", Map.of("used", sub.getEmailsSent(), "limit", sub.getMaxEmailsPerMonth()));
    usage.put("scheduledPosts", Map.of("used", sub.getScheduledPosts(), "limit", sub.getMaxScheduledPosts()));
    usage.put("periodEnd", sub.getCurrentPeriodEnd());
    return usage;
  }
}
