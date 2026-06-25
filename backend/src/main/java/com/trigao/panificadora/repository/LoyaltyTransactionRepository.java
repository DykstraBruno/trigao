package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.LoyaltyTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, Long> {
    Page<LoyaltyTransaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT t FROM LoyaltyTransaction t " +
           "WHERE t.user.id = :userId AND t.order.id = :orderId AND t.type = com.trigao.panificadora.model.LoyaltyTransaction$Type.EARN")
    Optional<LoyaltyTransaction> findEarnByUserAndOrder(@Param("userId") Long userId,
                                                       @Param("orderId") Long orderId);
}
