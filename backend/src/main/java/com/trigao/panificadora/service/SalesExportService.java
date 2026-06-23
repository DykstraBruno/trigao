package com.trigao.panificadora.service;

import com.trigao.panificadora.model.Order;
import com.trigao.panificadora.model.OrderItem;
import com.trigao.panificadora.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesExportService {

    private static final ZoneId TZ = ZoneId.of("America/Fortaleza");
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter D_FMT  = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final OrderRepository orderRepository;

    public String buildCsv(LocalDate from, LocalDate to, Long storeId) {
        List<Order> orders = fetch(from, to, storeId);
        StringBuilder sb = new StringBuilder();
        sb.append("﻿"); // BOM UTF-8 p/ Excel reconhecer acentos
        sb.append("ID;Data;Cliente;Email;Telefone;Loja;Status;Pagamento;Itens;Total (R$)\n");
        for (Order o : orders) {
            int itemCount = o.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
            sb.append(o.getId()).append(';')
              .append(formatDT(o.getCreatedAt())).append(';')
              .append(csv(o.getUser() != null ? o.getUser().getName() : "")).append(';')
              .append(csv(o.getUser() != null ? o.getUser().getEmail() : "")).append(';')
              .append(csv(o.getUser() != null ? o.getUser().getPhone() : "")).append(';')
              .append(csv(o.getStore() != null ? o.getStore().getName() : "")).append(';')
              .append(o.getStatus().name()).append(';')
              .append(csv(o.getPaymentMethod())).append(';')
              .append(itemCount).append(';')
              .append(money(o.getTotalAmount()))
              .append('\n');
        }
        return sb.toString();
    }

    public ExportSummary buildHtmlReport(LocalDate from, LocalDate to, Long storeId) {
        List<Order> orders = fetch(from, to, storeId);

        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .mapToInt(OrderItem::getQuantity)
                .sum();

        BigDecimal avgTicket = orders.isEmpty()
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(orders.size()), 2, java.math.RoundingMode.HALF_UP);

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang=\"pt-BR\"><head>");
        html.append("<meta charset=\"UTF-8\">");
        html.append("<title>Relatório de Vendas — Trigão Panificadora</title>");
        html.append("<style>");
        html.append("body { font-family: 'Inter', sans-serif; color: #2C1810; margin: 24px; }");
        html.append("h1 { color: #C7392F; margin: 0 0 4px; }");
        html.append(".meta { color: #6D3A21; margin-bottom: 1.5rem; }");
        html.append(".kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }");
        html.append(".kpi { background: #FFFDF6; border: 1px solid #f0e2cf; border-radius: 8px; padding: 12px; }");
        html.append(".kpi strong { display: block; font-size: 1.2rem; color: #C7392F; }");
        html.append(".kpi small { color: #99603E; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }");
        html.append("table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }");
        html.append("th, td { padding: 6px 8px; border-bottom: 1px solid #f0e6d8; text-align: left; }");
        html.append("th { background: #C7392F; color: white; }");
        html.append("tfoot td { font-weight: bold; border-top: 2px solid #C7392F; }");
        html.append(".center { text-align: center; }");
        html.append(".right  { text-align: right; }");
        html.append("@media print { body { margin: 0; } .no-print { display: none; } }");
        html.append(".print-btn { padding: 8px 16px; background: #C7392F; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 16px; font-size: 0.9rem; }");
        html.append("</style></head><body>");

        html.append("<button class=\"print-btn no-print\" onclick=\"window.print()\">🖨 Imprimir / Salvar PDF</button>");
        html.append("<h1>Relatório de Vendas — Trigão Panificadora</h1>");
        html.append("<div class=\"meta\">Período: ").append(from.format(D_FMT)).append(" a ").append(to.format(D_FMT));
        if (storeId != null && !orders.isEmpty() && orders.get(0).getStore() != null) {
            html.append(" · Loja: ").append(escape(orders.get(0).getStore().getName()));
        }
        html.append("</div>");

        html.append("<div class=\"kpis\">");
        html.append("<div class=\"kpi\"><small>Pedidos</small><strong>").append(orders.size()).append("</strong></div>");
        html.append("<div class=\"kpi\"><small>Receita total</small><strong>R$ ").append(money(totalRevenue)).append("</strong></div>");
        html.append("<div class=\"kpi\"><small>Ticket médio</small><strong>R$ ").append(money(avgTicket)).append("</strong></div>");
        html.append("<div class=\"kpi\"><small>Itens vendidos</small><strong>").append(totalItems).append("</strong></div>");
        html.append("</div>");

        html.append("<table>");
        html.append("<thead><tr>");
        html.append("<th>#</th><th>Data</th><th>Cliente</th><th>Loja</th><th>Status</th><th>Pgto</th>");
        html.append("<th class=\"center\">Itens</th><th class=\"right\">Total</th>");
        html.append("</tr></thead><tbody>");
        for (Order o : orders) {
            int itemCount = o.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
            html.append("<tr>");
            html.append("<td>").append(o.getId()).append("</td>");
            html.append("<td>").append(formatDT(o.getCreatedAt())).append("</td>");
            html.append("<td>").append(escape(o.getUser() != null ? o.getUser().getName() : "—")).append("</td>");
            html.append("<td>").append(escape(o.getStore() != null ? o.getStore().getName() : "—")).append("</td>");
            html.append("<td>").append(o.getStatus().name()).append("</td>");
            html.append("<td>").append(escape(o.getPaymentMethod() != null ? o.getPaymentMethod() : "—")).append("</td>");
            html.append("<td class=\"center\">").append(itemCount).append("</td>");
            html.append("<td class=\"right\">R$ ").append(money(o.getTotalAmount())).append("</td>");
            html.append("</tr>");
        }
        html.append("</tbody>");
        html.append("<tfoot><tr><td colspan=\"7\" class=\"right\">Total geral</td><td class=\"right\">R$ ")
            .append(money(totalRevenue)).append("</td></tr></tfoot>");
        html.append("</table>");

        html.append("</body></html>");
        return new ExportSummary(html.toString(), orders.size(), totalRevenue);
    }

    private List<Order> fetch(LocalDate from, LocalDate to, Long storeId) {
        Instant start = from.atStartOfDay(TZ).toInstant();
        Instant end   = to.plusDays(1).atStartOfDay(TZ).toInstant();
        return orderRepository.findForExport(start, end, storeId);
    }

    private String formatDT(Instant i) {
        return i == null ? "" : DT_FMT.format(i.atZone(TZ));
    }

    private String csv(String s) {
        if (s == null) return "";
        if (s.contains(";") || s.contains("\"") || s.contains("\n")) {
            return "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }

    private String money(BigDecimal v) {
        if (v == null) return "0,00";
        return v.setScale(2, java.math.RoundingMode.HALF_UP)
                .toPlainString()
                .replace('.', ',');
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    public static class ExportSummary {
        public final String html;
        public final int orderCount;
        public final BigDecimal totalRevenue;

        public ExportSummary(String html, int orderCount, BigDecimal totalRevenue) {
            this.html = html;
            this.orderCount = orderCount;
            this.totalRevenue = totalRevenue;
        }
    }
}
