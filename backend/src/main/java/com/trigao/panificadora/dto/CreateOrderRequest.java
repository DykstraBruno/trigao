package com.trigao.panificadora.dto;

import lombok.Data;
import javax.validation.constraints.*;
import java.util.List;

@Data
public class CreateOrderRequest {

    @NotNull @NotEmpty
    private List<OrderItemRequest> items;

    @NotNull
    private Long storeId;

    private String notes;
    private String address;

    @NotBlank
    private String paymentMethod; // PIX, CARD

    @Min(0)
    private Integer pointsToRedeem = 0;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull @Min(1)
        private Integer quantity;
    }
}
