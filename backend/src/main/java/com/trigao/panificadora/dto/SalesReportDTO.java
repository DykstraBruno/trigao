package com.trigao.panificadora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportDTO {
    private List<DailyPoint> history;
    private List<DailyPoint> forecast;
    private BigDecimal totalRevenue;
    private long totalOrders;
    private BigDecimal averageTicket;
    private BigDecimal growthWoW;
    private Integer movingAverageWindow;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyPoint {
        private LocalDate date;
        private BigDecimal revenue;
        private Long orders;
    }
}
