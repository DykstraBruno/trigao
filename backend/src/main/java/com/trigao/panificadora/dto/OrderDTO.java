package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Order;
import com.trigao.panificadora.model.OrderItem;
import com.trigao.panificadora.model.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDTO {

    private Long id;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String notes;
    private String billingUrl;
    private String paymentMethod;
    private String address;
    private Instant createdAt;
    private List<ItemDTO> items;

    @Data
    public static class ItemDTO {
        private Long productId;
        private String productName;
        private String productImageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    public static OrderDTO from(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.setId(o.getId());
        dto.setStatus(o.getStatus());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setNotes(o.getNotes());
        dto.setBillingUrl(o.getBillingUrl());
        dto.setPaymentMethod(o.getPaymentMethod());
        dto.setAddress(o.getAddress());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setItems(o.getItems().stream().map(OrderDTO::mapItem).collect(Collectors.toList()));
        return dto;
    }

    private static ItemDTO mapItem(OrderItem oi) {
        ItemDTO item = new ItemDTO();
        item.setProductId(oi.getProduct().getId());
        item.setProductName(oi.getProduct().getName());
        item.setProductImageUrl(oi.getProduct().getImageUrl());
        item.setQuantity(oi.getQuantity());
        item.setUnitPrice(oi.getUnitPrice());
        item.setSubtotal(oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())));
        return item;
    }
}
