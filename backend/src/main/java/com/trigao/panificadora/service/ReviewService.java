package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.*;
import com.trigao.panificadora.model.*;
import com.trigao.panificadora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewDTO> listByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId)
                .stream().map(ReviewDTO::from).collect(Collectors.toList());
    }

    public ReviewSummaryDTO summary(Long productId) {
        List<Object[]> rows = reviewRepository.ratingDistribution(productId);
        Map<Integer, Long> dist = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) dist.put(i, 0L);
        long total = 0;
        long sum = 0;
        for (Object[] row : rows) {
            int rating = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            dist.put(rating, count);
            total += count;
            sum += (long) rating * count;
        }
        double avg = total == 0 ? 0.0 : Math.round((sum * 10.0 / total)) / 10.0;
        return new ReviewSummaryDTO(total, avg, dist);
    }

    @Transactional
    public ReviewDTO create(String email, CreateReviewRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Pedido não pertence ao usuário.");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Só é possível avaliar produtos de pedidos entregues.");
        }
        boolean productInOrder = order.getItems().stream()
                .anyMatch(it -> it.getProduct() != null && it.getProduct().getId().equals(product.getId()));
        if (!productInOrder) {
            throw new IllegalArgumentException("Produto não está nesse pedido.");
        }
        if (reviewRepository.existsByUserIdAndProductIdAndOrderId(user.getId(), product.getId(), order.getId())) {
            throw new IllegalArgumentException("Você já avaliou esse produto neste pedido.");
        }

        ProductReview r = new ProductReview();
        r.setProduct(product);
        r.setUser(user);
        r.setOrder(order);
        r.setRating(req.getRating());
        r.setComment(req.getComment());
        return ReviewDTO.from(reviewRepository.save(r));
    }

    public List<ReviewableItemDTO> reviewableForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        // Pedidos entregues do usuário
        List<Order> delivered = orderRepository.findByUserIdOrderByCreatedAtDesc(
                user.getId(), org.springframework.data.domain.PageRequest.of(0, 50))
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .collect(Collectors.toList());

        List<ReviewableItemDTO> result = new ArrayList<>();
        for (Order o : delivered) {
            for (OrderItem item : o.getItems()) {
                Product p = item.getProduct();
                if (p == null) continue;
                boolean already = reviewRepository.existsByUserIdAndProductIdAndOrderId(
                        user.getId(), p.getId(), o.getId());
                if (!already) {
                    result.add(new ReviewableItemDTO(o.getId(), p.getId(), p.getName(), p.getImageUrl()));
                }
            }
        }
        return result;
    }

    @Transactional
    public void delete(Long reviewId, String email, boolean isAdmin) {
        ProductReview r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review não encontrada."));
        if (!isAdmin) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
            if (r.getUser() == null || !r.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Sem permissão.");
            }
        }
        reviewRepository.delete(r);
    }
}
