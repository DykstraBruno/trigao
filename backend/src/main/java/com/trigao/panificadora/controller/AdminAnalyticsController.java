package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.SalesReportDTO;
import com.trigao.panificadora.service.SalesAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final SalesAnalyticsService salesAnalyticsService;

    @GetMapping("/sales")
    public ResponseEntity<SalesReportDTO> sales(
            @RequestParam(defaultValue = "30") int historyDays,
            @RequestParam(defaultValue = "7") int forecastDays,
            @RequestParam(required = false) Long storeId) {
        return ResponseEntity.ok(salesAnalyticsService.getReport(historyDays, forecastDays, storeId));
    }
}
