package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.OrderDTO;
import com.trigao.panificadora.dto.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishCreated(OrderDTO order) {
        publish(order, OrderEvent.created(order));
    }

    public void publishUpdated(OrderDTO order) {
        publish(order, OrderEvent.updated(order));
    }

    private void publish(OrderDTO order, OrderEvent event) {
        if (order.getStoreId() == null) {
            log.debug("Pedido {} sem loja, skip broadcast.", order.getId());
            return;
        }
        String destination = "/topic/store/" + order.getStoreId() + "/orders";
        try {
            messagingTemplate.convertAndSend(destination, event);
        } catch (Exception e) {
            log.warn("Falha ao publicar evento de pedido {}: {}", order.getId(), e.getMessage());
        }
    }
}
