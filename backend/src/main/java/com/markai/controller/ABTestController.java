package com.markai.controller;

import com.markai.dto.ABTestRequest;
import com.markai.model.ABTest;
import com.markai.model.User;
import com.markai.service.ABTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ab-tests")
public class ABTestController {

  private final ABTestService abTestService;

  public ABTestController(ABTestService abTestService) {
    this.abTestService = abTestService;
  }

  @PostMapping
  public ResponseEntity<ABTest> createTest(
      @RequestBody ABTestRequest request,
      @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(abTestService.createTest(request, user));
  }

  @GetMapping
  public ResponseEntity<List<ABTest>> getTests(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(abTestService.getTests(user.getTenantId()));
  }

  @PostMapping("/{id}/start")
  public ResponseEntity<ABTest> startTest(@PathVariable Long id) {
    return ResponseEntity.ok(abTestService.startTest(id));
  }

  @GetMapping("/{id}/results")
  public ResponseEntity<Map<String, Object>> getResults(@PathVariable Long id) {
    return ResponseEntity.ok(abTestService.getTestResults(id));
  }

  @PostMapping("/{id}/end")
  public ResponseEntity<ABTest> endTest(@PathVariable Long id) {
    return ResponseEntity.ok(abTestService.endTest(id));
  }
}
