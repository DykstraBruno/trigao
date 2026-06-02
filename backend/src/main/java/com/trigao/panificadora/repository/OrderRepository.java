package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.Order;
import com.trigao.panificadora.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByBillingId(String billingId);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Order> findByStoreIdOrderByCreatedAtDesc(Long storeId, Pageable pageable);
    Page<Order> findByStoreIdAndStatusOrderByCreatedAtDesc(Long storeId, OrderStatus status, Pageable pageable);

    // Agregados para analytics — exclui pedidos não-confirmados
    @Query(value = "SELECT DATE_TRUNC('day', o.created_at AT TIME ZONE 'America/Fortaleza') AS day, " +
                   "       COUNT(*) AS orders, " +
                   "       COALESCE(SUM(o.total_amount), 0) AS revenue " +
                   "FROM orders o " +
                   "WHERE o.created_at >= :since " +
                   "  AND o.status NOT IN ('PENDING', 'CANCELLED') " +
                   "  AND (:storeId IS NULL OR o.store_id = :storeId) " +
                   "GROUP BY day " +
                   "ORDER BY day ASC",
           nativeQuery = true)
    List<Object[]> aggregateDailySales(@Param("since") Instant since,
                                       @Param("storeId") Long storeId);
}
