package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.Order;
import com.trigao.panificadora.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByBillingId(String billingId);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
