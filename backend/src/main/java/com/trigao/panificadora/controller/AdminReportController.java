package com.trigao.panificadora.controller;

import com.trigao.panificadora.service.SalesExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReportController {

    private final SalesExportService exportService;

    @GetMapping(value = "/sales.csv", produces = "text/csv;charset=UTF-8")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Long storeId) {
        String csv = exportService.buildCsv(from, to, storeId);
        byte[] body = csv.getBytes(StandardCharsets.UTF_8);
        String filename = String.format("vendas-trigao-%s-a-%s.csv", from, to);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv;charset=UTF-8");
        return new ResponseEntity<>(body, headers, 200);
    }

    @GetMapping(value = "/sales.html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> exportHtml(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Long storeId) {
        SalesExportService.ExportSummary summary = exportService.buildHtmlReport(from, to, storeId);
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("text/html;charset=UTF-8"))
                .body(summary.html);
    }
}
