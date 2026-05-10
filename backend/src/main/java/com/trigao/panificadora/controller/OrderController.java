package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.CreateOrderRequest;
import com.trigao.panificadora.dto.OrderDTO;
import com.trigao.panificadora.model.OrderStatus;
import com.trigao.panificadora.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(user.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<Page<OrderDTO>> myOrders(
            @AuthenticationPrincipal UserDetails user,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.findByUser(user.getUsername(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.findById(id, user.getUsername()));
    }

    // Admin
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDTO>> allOrders(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(orderService.findAll(pageable));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    // Manager: pedidos da própria loja
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Page<OrderDTO>> managerOrders(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(orderService.findByManagerStore(user.getUsername(), status, pageable));
    }

    @PatchMapping("/manager/{id}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<OrderDTO> managerUpdateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.updateStatusAsManager(id, status, user.getUsername()));
    }
}
