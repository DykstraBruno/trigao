package com.trigao.panificadora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ReviewSummaryDTO {
    private long count;
    private double average;
    private Map<Integer, Long> distribution; // 1-5 -> total
}
