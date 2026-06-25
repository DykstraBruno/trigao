package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.LoyaltyBalanceDTO;
import com.trigao.panificadora.dto.LoyaltyTransactionDTO;
import com.trigao.panificadora.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/balance")
    public ResponseEntity<LoyaltyBalanceDTO> balance(Authentication auth) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return ResponseEntity.ok(loyaltyService.balance(email));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<LoyaltyTransactionDTO>> history(
            Authentication auth,
            @PageableDefault(size = 50) Pageable pageable) {
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return ResponseEntity.ok(loyaltyService.history(email, pageable));
    }
}
