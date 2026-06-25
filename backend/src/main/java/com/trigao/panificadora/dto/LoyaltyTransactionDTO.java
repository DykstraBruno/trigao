package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.LoyaltyTransaction;
import lombok.Data;

import java.time.Instant;

@Data
public class LoyaltyTransactionDTO {
    private Long id;
    private String type;
    private Integer points;
    private Integer balanceAfter;
    private String description;
    private Long orderId;
    private Instant createdAt;

    public static LoyaltyTransactionDTO from(LoyaltyTransaction t) {
        LoyaltyTransactionDTO dto = new LoyaltyTransactionDTO();
        dto.setId(t.getId());
        dto.setType(t.getType().name());
        dto.setPoints(t.getPoints());
        dto.setBalanceAfter(t.getBalanceAfter());
        dto.setDescription(t.getDescription());
        dto.setOrderId(t.getOrder() != null ? t.getOrder().getId() : null);
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
