package com.markai.controller;

import com.markai.dto.PricingResponse;
import com.markai.model.Subscription;
import com.markai.model.User;
import com.markai.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

  private final BillingService billingService;

  public BillingController(BillingService billingService) {
    this.billingService = billingService;
  }

  /**
   * Get pricing for a specific country (auto-currency conversion).
   */
  @GetMapping("/pricing")
  public ResponseEntity<PricingResponse> getPricing(
      @RequestParam(defaultValue = "US") String country) {
    return ResponseEntity.ok(billingService.getPricing(country));
  }

  /**
   * Get the current user's subscription.
   */
  @GetMapping("/subscription")
  public ResponseEntity<Subscription> getSubscription(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(billingService.getSubscription(user.getTenantId(), user));
  }

  /**
   * Create a Razorpay checkout session.
   */
  @PostMapping("/checkout")
  public ResponseEntity<Map<String, Object>> createCheckout(
      @AuthenticationPrincipal User user,
      @RequestBody Map<String, Object> body) {
    String planId = (String) body.get("planId");
    String country = (String) body.getOrDefault("country", "US");
    boolean yearly = Boolean.TRUE.equals(body.get("yearly"));

    return ResponseEntity.ok(billingService.createCheckout(
        user.getTenantId(), planId, country, yearly));
  }

  /**
   * Confirm payment after Razorpay callback.
   */
  @PostMapping("/confirm")
  public ResponseEntity<Subscription> confirmPayment(
      @AuthenticationPrincipal User user,
      @RequestBody Map<String, String> body) {
    return ResponseEntity.ok(billingService.activateSubscription(
        user.getTenantId(),
        body.get("planId"),
        body.get("razorpay_payment_id"),
        body.get("razorpay_order_id"),
        body.getOrDefault("country", "US"),
        Boolean.parseBoolean(body.getOrDefault("yearly", "false"))));
  }

  /**
   * Cancel subscription.
   */
  @PostMapping("/cancel")
  public ResponseEntity<Subscription> cancelSubscription(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(billingService.cancelSubscription(user.getTenantId()));
  }

  /**
   * Get usage stats for current plan.
   */
  @GetMapping("/usage")
  public ResponseEntity<Map<String, Object>> getUsage(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(billingService.getUsage(user.getTenantId()));
  }
}
