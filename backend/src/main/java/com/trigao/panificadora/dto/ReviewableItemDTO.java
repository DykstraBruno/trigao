package com.trigao.panificadora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewableItemDTO {
    private Long orderId;
    private Long productId;
    private String productName;
    private String productImageUrl;
}
