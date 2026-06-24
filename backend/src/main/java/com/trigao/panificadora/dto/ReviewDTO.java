package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.ProductReview;
import lombok.Data;

import java.time.Instant;

@Data
public class ReviewDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Long orderId;
    private String userName;
    private Integer rating;
    private String comment;
    private Instant createdAt;

    public static ReviewDTO from(ProductReview r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        if (r.getProduct() != null) {
            dto.setProductId(r.getProduct().getId());
            dto.setProductName(r.getProduct().getName());
        }
        if (r.getOrder() != null) dto.setOrderId(r.getOrder().getId());
        if (r.getUser() != null)  dto.setUserName(maskName(r.getUser().getName()));
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    // Privacidade: João Silva -> "João S."
    private static String maskName(String name) {
        if (name == null || name.isBlank()) return "Cliente";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
    }
}
