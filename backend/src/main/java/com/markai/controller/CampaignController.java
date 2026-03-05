package com.markai.controller;

import com.markai.dto.CampaignRequest;
import com.markai.dto.DashboardStats;
import com.markai.model.Campaign;
import com.markai.model.User;
import com.markai.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(
            @RequestBody CampaignRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(campaignService.createCampaign(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getCampaigns(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(campaignService.getCampaigns(user.getTenantId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaign(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Campaign> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(campaignService.updateCampaignStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(campaignService.getDashboardStats(user));
    }
}
