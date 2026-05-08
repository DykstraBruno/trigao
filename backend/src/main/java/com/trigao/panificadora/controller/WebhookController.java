package com.trigao.panificadora.controller;

import com.trigao.panificadora.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@Slf4j
@RequiredArgsConstructor
public class WebhookController {

    private final OrderService orderService;

    /**
     * Webhook do AbacatePay para eventos de pagamento.
     * Referência: https://docs.abacatepay.com/pages/webhooks
     */
    @PostMapping("/abacatepay")
    public ResponseEntity<Void> handleAbacatePay(@RequestBody Map<String, Object> payload) {
        log.info("Webhook AbacatePay recebido: {}", payload.get("event"));

        String event = (String) payload.get("event");
        if ("billing.paid".equals(event) || "checkout.paid".equals(event)) {
            Object data = payload.get("data");
            if (data instanceof Map) {
                String billingId = (String) ((Map<?, ?>) data).get("id");
                if (billingId != null) {
                    orderService.handlePaymentConfirmed(billingId);
                }
            }
        }
        return ResponseEntity.ok().build();
    }
}
