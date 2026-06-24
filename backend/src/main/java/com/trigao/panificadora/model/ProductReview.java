package com.trigao.panificadora.model;

import lombok.*;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "product_reviews",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_review_user_product_order",
                columnNames = {"user_id", "product_id", "order_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private Boolean approved = true;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();
}
