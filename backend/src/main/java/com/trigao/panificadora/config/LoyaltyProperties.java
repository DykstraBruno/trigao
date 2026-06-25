package com.trigao.panificadora.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Data
@Configuration
@ConfigurationProperties(prefix = "loyalty")
public class LoyaltyProperties {
    /** R$ gastos para 1 ponto. */
    private BigDecimal earnRatio = new BigDecimal("5.00");
    /** Pontos necessários para R$ 1,00 de desconto. */
    private int redeemRatio = 20;
    /** Máximo de pontos que podem cobrir % do pedido (0..1). */
    private double maxRedeemFraction = 0.5;

    public BigDecimal pointsToBrl(int points) {
        if (redeemRatio <= 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(points).divide(BigDecimal.valueOf(redeemRatio), 2, java.math.RoundingMode.HALF_UP);
    }

    public int brlSpentToPoints(BigDecimal brl) {
        if (brl == null || earnRatio.signum() == 0) return 0;
        return brl.divide(earnRatio, 0, java.math.RoundingMode.DOWN).intValue();
    }
}
