package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.*;
import com.trigao.panificadora.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Público
    @GetMapping("/api/products/{id}/reviews")
    public ResponseEntity<List<ReviewDTO>> listByProduct(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.listByProduct(id));
    }

    @GetMapping("/api/products/{id}/reviews/summary")
    public ResponseEntity<ReviewSummaryDTO> summary(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.summary(id));
    }

    // Autenticado
    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewDTO> create(@Valid @RequestBody CreateReviewRequest req,
                                            Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return ResponseEntity.ok(reviewService.create(email, req));
    }

    @GetMapping("/api/reviews/reviewable")
    public ResponseEntity<List<ReviewableItemDTO>> reviewable(Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return ResponseEntity.ok(reviewService.reviewableForUser(email));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        reviewService.delete(id, email, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
