package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.CreateOrderRequest;
import com.trigao.panificadora.dto.OrderDTO;
import com.trigao.panificadora.model.*;
import com.trigao.panificadora.repository.OrderRepository;
import com.trigao.panificadora.repository.ProductRepository;
import com.trigao.panificadora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AbacatePayService abacatePayService;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Transactional
    public OrderDTO createOrder(String email, CreateOrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Order order = new Order();
        order.setUser(user);
        order.setNotes(request.getNotes());
        order.setAddress(request.getAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .filter(Product::getActive)
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Estoque insuficiente para: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getPrice());
            items.add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);
        }

        order.setItems(items);
        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        // Criar checkout no AbacatePay
        createAbacatePayCheckout(saved, request.getPaymentMethod());

        return OrderDTO.from(orderRepository.findById(saved.getId()).orElseThrow());
    }

    private void createAbacatePayCheckout(Order order, String paymentMethod) {
        // Mapear itens para produtos do AbacatePay
        List<AbacatePayService.CheckoutItem> checkoutItems = order.getItems().stream()
                .map(item -> {
                    String abacateId = item.getProduct().getAbacatePayProductId();
                    if (abacateId == null || abacateId.isBlank()) {
                        // Cria o produto no AbacatePay on-the-fly
                        abacateId = ensureAbacatePayProduct(item.getProduct());
                    }
                    return new AbacatePayService.CheckoutItem(abacateId, item.getQuantity());
                })
                .collect(Collectors.toList());

        AbacatePayService.CheckoutRequest checkoutReq = new AbacatePayService.CheckoutRequest();
        checkoutReq.setItems(checkoutItems);
        checkoutReq.setMethods(List.of(paymentMethod.equalsIgnoreCase("CARD") ? "CARD" : "PIX"));
        checkoutReq.setReturnUrl(frontendUrl + "/sacola");
        checkoutReq.setCompletionUrl(frontendUrl + "/pedido/" + order.getId() + "/confirmacao");
        checkoutReq.setExternalId("pedido-" + order.getId());

        AbacatePayService.CheckoutResponse response = abacatePayService.createCheckout(checkoutReq);

        if (Boolean.TRUE.equals(response.getSuccess()) && response.getData() != null) {
            order.setBillingId(response.getData().getId());
            order.setBillingUrl(response.getData().getUrl());
            orderRepository.save(order);
        } else {
            log.warn("Falha ao criar checkout AbacatePay para pedido {}: {}", order.getId(), response.getError());
        }
    }

    private String ensureAbacatePayProduct(Product product) {
        AbacatePayService.CreateProductRequest req = new AbacatePayService.CreateProductRequest();
        req.setExternalId("product-" + product.getId());
        req.setName(product.getName());
        req.setDescription(product.getDescription() != null ? product.getDescription() : product.getName());
        req.setPrice(AbacatePayService.toCents(product.getPrice()));

        AbacatePayService.ProductResponse resp = abacatePayService.createProduct(req);
        if (Boolean.TRUE.equals(resp.getSuccess()) && resp.getData() != null) {
            String abacateId = (String) resp.getData().get("id");
            product.setAbacatePayProductId(abacateId);
            productRepository.save(product);
            return abacateId;
        }
        throw new IllegalStateException("Falha ao registrar produto no AbacatePay: " + product.getName());
    }

    public Page<OrderDTO> findByUser(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).map(OrderDTO::from);
    }

    public OrderDTO findById(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Acesso negado.");
        }
        return OrderDTO.from(order);
    }

    // Chamado pelo webhook do AbacatePay
    @Transactional
    public void handlePaymentConfirmed(String billingId) {
        orderRepository.findByBillingId(billingId).ifPresent(order -> {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            log.info("Pedido {} marcado como PAGO.", order.getId());
        });
    }

    // Admin: listar todos pedidos
    public Page<OrderDTO> findAll(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(OrderDTO::from);
    }

    @Transactional
    public OrderDTO updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
        order.setStatus(status);
        return OrderDTO.from(orderRepository.save(order));
    }
}
