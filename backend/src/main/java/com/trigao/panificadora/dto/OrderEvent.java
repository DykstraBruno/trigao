package com.trigao.panificadora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class OrderEvent {
    public enum Type { CREATED, UPDATED }

    private Type type;
    private OrderDTO order;
    private Instant timestamp;

    public static OrderEvent created(OrderDTO order) {
        return new OrderEvent(Type.CREATED, order, Instant.now());
    }

    public static OrderEvent updated(OrderDTO order) {
        return new OrderEvent(Type.UPDATED, order, Instant.now());
    }
}
