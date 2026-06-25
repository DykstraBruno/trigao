package com.trigao.panificadora.service;

import com.trigao.panificadora.config.LoyaltyProperties;
import com.trigao.panificadora.dto.*;
import com.trigao.panificadora.model.*;
import com.trigao.panificadora.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoyaltyService {

    private final LoyaltyTransactionRepository txRepo;
    private final UserRepository userRepo;
    private final LoyaltyProperties props;

    public LoyaltyBalanceDTO balance(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        int points = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
        return new LoyaltyBalanceDTO(
                points,
                props.pointsToBrl(points),
                props.getEarnRatio(),
                props.getRedeemRatio(),
                props.getMaxRedeemFraction()
        );
    }

    public Page<LoyaltyTransactionDTO> history(String email, Pageable pageable) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        return txRepo.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(LoyaltyTransactionDTO::from);
    }

    /** Calcula desconto máximo dado pontos + total bruto. */
    public BigDecimal computeDiscount(int requestedPoints, BigDecimal grossTotal, int availablePoints) {
        if (requestedPoints <= 0 || grossTotal == null || grossTotal.signum() <= 0) return BigDecimal.ZERO;
        int usable = Math.min(requestedPoints, availablePoints);
        BigDecimal maxDiscount = grossTotal.multiply(BigDecimal.valueOf(props.getMaxRedeemFraction()))
                                           .setScale(2, RoundingMode.DOWN);
        BigDecimal discount = props.pointsToBrl(usable);
        return discount.min(maxDiscount);
    }

    /** Pontos efetivamente debitados dado um desconto aplicado. */
    public int pointsForDiscount(BigDecimal discount) {
        if (discount == null || discount.signum() <= 0) return 0;
        return discount.multiply(BigDecimal.valueOf(props.getRedeemRatio()))
                       .setScale(0, RoundingMode.UP)
                       .intValue();
    }

    @Transactional
    public LoyaltyTransaction recordRedeem(User user, Order order, int points, BigDecimal discount) {
        if (points <= 0) return null;
        int newBalance = Math.max(0, (user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints()) - points);
        user.setLoyaltyPoints(newBalance);
        userRepo.save(user);

        LoyaltyTransaction tx = new LoyaltyTransaction();
        tx.setUser(user);
        tx.setOrder(order);
        tx.setType(LoyaltyTransaction.Type.REDEEM);
        tx.setPoints(-points);
        tx.setBalanceAfter(newBalance);
        tx.setDescription("Resgate de " + points + " pts (R$ " + discount.setScale(2, RoundingMode.HALF_UP) + ")");
        return txRepo.save(tx);
    }

    @Transactional
    public LoyaltyTransaction recordEarn(Order order) {
        if (order == null || order.getUser() == null) return null;
        if (txRepo.findEarnByUserAndOrder(order.getUser().getId(), order.getId()).isPresent()) {
            log.debug("Pedido {} já creditou pontos.", order.getId());
            return null;
        }
        BigDecimal base = order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount();
        int points = props.brlSpentToPoints(base);
        if (points <= 0) return null;

        User user = order.getUser();
        int newBalance = (user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints()) + points;
        user.setLoyaltyPoints(newBalance);
        userRepo.save(user);

        order.setLoyaltyPointsEarned(points);

        LoyaltyTransaction tx = new LoyaltyTransaction();
        tx.setUser(user);
        tx.setOrder(order);
        tx.setType(LoyaltyTransaction.Type.EARN);
        tx.setPoints(points);
        tx.setBalanceAfter(newBalance);
        tx.setDescription("Pedido #" + order.getId() + " creditou " + points + " pts");
        return txRepo.save(tx);
    }
}
