package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(Long productId);

    boolean existsByUserIdAndProductIdAndOrderId(Long userId, Long productId, Long orderId);

    @Query("SELECT r.rating AS rating, COUNT(r) AS total " +
           "FROM ProductReview r " +
           "WHERE r.product.id = :productId AND r.approved = true " +
           "GROUP BY r.rating")
    List<Object[]> ratingDistribution(@Param("productId") Long productId);

    List<ProductReview> findByUserIdOrderByCreatedAtDesc(Long userId);
}
