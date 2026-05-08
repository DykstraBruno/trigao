package com.trigao.panificadora.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AbacatePayService {

    @Value("${abacatepay.api-key}")
    private String apiKey;

    @Value("${abacatepay.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    // DTO interno para criar checkout
    @Data
    public static class CheckoutItem {
        private String id;
        private Integer quantity;
        public CheckoutItem(String id, Integer quantity) {
            this.id = id;
            this.quantity = quantity;
        }
    }

    @Data
    public static class CheckoutRequest {
        private List<CheckoutItem> items;
        private List<String> methods;
        private String returnUrl;
        private String completionUrl;
        private String externalId;
    }

    @Data
    public static class CheckoutResponse {
        private Boolean success;
        private String error;
        private BillingData data;
    }

    @Data
    public static class BillingData {
        private String id;
        private String url;
        private Long amount;
        private String status;
        private Boolean devMode;
        private String createdAt;
    }

    /**
     * Cria um produto no AbacatePay para ser usado nos checkouts.
     */
    @Data
    public static class CreateProductRequest {
        private String externalId;
        private String name;
        private String description;
        private Long price; // em centavos
    }

    @Data
    public static class ProductResponse {
        private Boolean success;
        private String error;
        private Map<String, Object> data;
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    public CheckoutResponse createCheckout(CheckoutRequest request) {
        HttpEntity<CheckoutRequest> entity = new HttpEntity<>(request, buildHeaders());
        try {
            ResponseEntity<CheckoutResponse> response = restTemplate.postForEntity(
                    baseUrl + "/checkouts/create", entity, CheckoutResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Erro ao criar checkout no AbacatePay: {}", e.getMessage());
            CheckoutResponse error = new CheckoutResponse();
            error.setSuccess(false);
            error.setError("Falha ao conectar com AbacatePay: " + e.getMessage());
            return error;
        }
    }

    public ProductResponse createProduct(CreateProductRequest request) {
        HttpEntity<CreateProductRequest> entity = new HttpEntity<>(request, buildHeaders());
        try {
            ResponseEntity<ProductResponse> response = restTemplate.postForEntity(
                    baseUrl + "/products/create", entity, ProductResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Erro ao criar produto no AbacatePay: {}", e.getMessage());
            ProductResponse error = new ProductResponse();
            error.setSuccess(false);
            error.setError("Falha ao criar produto: " + e.getMessage());
            return error;
        }
    }

    /**
     * Converte BigDecimal para centavos (inteiro).
     */
    public static long toCents(BigDecimal value) {
        return value.multiply(BigDecimal.valueOf(100)).longValue();
    }
}
