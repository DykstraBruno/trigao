package com.trigao.panificadora.dto;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class CreateReviewRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Long orderId;

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    @Size(max = 1000)
    private String comment;
}
