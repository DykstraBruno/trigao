package com.trigao.panificadora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class LoyaltyBalanceDTO {
    private int points;
    private BigDecimal equivalentBrl;
    private BigDecimal earnRatioBrl;   // R$ por ponto
    private int redeemRatioPoints;     // pontos para R$ 1,00
    private double maxRedeemFraction;
}
