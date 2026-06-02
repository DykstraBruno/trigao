package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.SalesReportDTO;
import com.trigao.panificadora.dto.SalesReportDTO.DailyPoint;
import com.trigao.panificadora.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SalesAnalyticsService {

    private static final ZoneId TZ = ZoneId.of("America/Fortaleza");
    private static final int MA_WINDOW = 7;

    private final OrderRepository orderRepository;

    public SalesReportDTO getReport(int historyDays, int forecastDays, Long storeId) {
        int days = Math.max(7, Math.min(historyDays, 180));
        int forecast = Math.max(0, Math.min(forecastDays, 30));

        LocalDate today = LocalDate.now(TZ);
        LocalDate from = today.minusDays(days - 1L);
        Instant since = from.atStartOfDay(TZ).toInstant();

        List<Object[]> rows = orderRepository.aggregateDailySales(since, storeId);
        Map<LocalDate, DailyPoint> byDay = new HashMap<>();
        for (Object[] row : rows) {
            LocalDate d = extractDate(row[0]);
            long orders = ((Number) row[1]).longValue();
            BigDecimal revenue = toBigDecimal(row[2]);
            byDay.put(d, new DailyPoint(d, revenue, orders));
        }

        List<DailyPoint> history = new ArrayList<>(days);
        BigDecimal totalRevenue = BigDecimal.ZERO;
        long totalOrders = 0L;

        for (int i = 0; i < days; i++) {
            LocalDate d = from.plusDays(i);
            DailyPoint p = byDay.getOrDefault(d, new DailyPoint(d, BigDecimal.ZERO, 0L));
            history.add(p);
            totalRevenue = totalRevenue.add(p.getRevenue());
            totalOrders += p.getOrders();
        }

        List<DailyPoint> forecastSeries = forecast > 0
                ? buildForecast(history, today, forecast)
                : Collections.emptyList();

        BigDecimal averageTicket = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal growthWoW = computeGrowthWoW(history);

        return new SalesReportDTO(history, forecastSeries, totalRevenue, totalOrders,
                averageTicket, growthWoW, MA_WINDOW);
    }

    // SMA(7) com ajuste sazonal por dia-da-semana
    private List<DailyPoint> buildForecast(List<DailyPoint> history, LocalDate today, int forecastDays) {
        int n = history.size();
        int window = Math.min(MA_WINDOW, n);
        BigDecimal sum = BigDecimal.ZERO;
        long ordersSum = 0L;
        for (int i = n - window; i < n; i++) {
            sum = sum.add(history.get(i).getRevenue());
            ordersSum += history.get(i).getOrders();
        }
        BigDecimal baseRevenue = sum.divide(BigDecimal.valueOf(window), 2, RoundingMode.HALF_UP);
        BigDecimal baseOrders = BigDecimal.valueOf(ordersSum).divide(BigDecimal.valueOf(window), 2, RoundingMode.HALF_UP);

        // Fator sazonal por DayOfWeek (avg dia / avg geral)
        Map<DayOfWeek, BigDecimal> dowFactor = computeDowFactor(history, baseRevenue);

        List<DailyPoint> out = new ArrayList<>(forecastDays);
        for (int i = 1; i <= forecastDays; i++) {
            LocalDate d = today.plusDays(i);
            BigDecimal factor = dowFactor.getOrDefault(d.getDayOfWeek(), BigDecimal.ONE);
            BigDecimal revenue = baseRevenue.multiply(factor).setScale(2, RoundingMode.HALF_UP);
            long orders = baseOrders.multiply(factor).setScale(0, RoundingMode.HALF_UP).longValue();
            out.add(new DailyPoint(d, revenue, orders));
        }
        return out;
    }

    private Map<DayOfWeek, BigDecimal> computeDowFactor(List<DailyPoint> history, BigDecimal baseRevenue) {
        if (baseRevenue.signum() == 0) return Collections.emptyMap();
        Map<DayOfWeek, BigDecimal[]> totals = new EnumMap<>(DayOfWeek.class);
        for (DailyPoint p : history) {
            BigDecimal[] agg = totals.computeIfAbsent(p.getDate().getDayOfWeek(),
                    k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            agg[0] = agg[0].add(p.getRevenue());
            agg[1] = agg[1].add(BigDecimal.ONE);
        }
        Map<DayOfWeek, BigDecimal> factor = new EnumMap<>(DayOfWeek.class);
        for (Map.Entry<DayOfWeek, BigDecimal[]> e : totals.entrySet()) {
            BigDecimal avg = e.getValue()[0].divide(e.getValue()[1], 4, RoundingMode.HALF_UP);
            factor.put(e.getKey(), avg.divide(baseRevenue, 4, RoundingMode.HALF_UP));
        }
        return factor;
    }

    private BigDecimal computeGrowthWoW(List<DailyPoint> history) {
        int n = history.size();
        if (n < 14) return BigDecimal.ZERO;
        BigDecimal last7 = sumRange(history, n - 7, n);
        BigDecimal prev7 = sumRange(history, n - 14, n - 7);
        if (prev7.signum() == 0) return BigDecimal.ZERO;
        return last7.subtract(prev7)
                .multiply(BigDecimal.valueOf(100))
                .divide(prev7, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal sumRange(List<DailyPoint> list, int from, int to) {
        BigDecimal sum = BigDecimal.ZERO;
        for (int i = from; i < to; i++) sum = sum.add(list.get(i).getRevenue());
        return sum;
    }

    private LocalDate extractDate(Object dbValue) {
        if (dbValue instanceof Timestamp) {
            return ((Timestamp) dbValue).toInstant().atZone(TZ).toLocalDate();
        }
        if (dbValue instanceof Instant) {
            return ((Instant) dbValue).atZone(TZ).toLocalDate();
        }
        if (dbValue instanceof LocalDate) {
            return (LocalDate) dbValue;
        }
        if (dbValue instanceof OffsetDateTime) {
            return ((OffsetDateTime) dbValue).atZoneSameInstant(TZ).toLocalDate();
        }
        return LocalDate.parse(dbValue.toString().substring(0, 10));
    }

    private BigDecimal toBigDecimal(Object dbValue) {
        if (dbValue instanceof BigDecimal) return (BigDecimal) dbValue;
        if (dbValue == null) return BigDecimal.ZERO;
        return new BigDecimal(dbValue.toString());
    }
}
