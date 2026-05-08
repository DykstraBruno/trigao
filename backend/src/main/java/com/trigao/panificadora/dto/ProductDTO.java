package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Product;
import lombok.Data;
import javax.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class ProductDTO {

    private Long id;

    @NotBlank @Size(max = 200)
    private String name;

    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    private String imageUrl;

    private Long categoryId;
    private String categoryName;

    private Boolean active;
    private Integer stock;

    public static ProductDTO from(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setImageUrl(p.getImageUrl());
        dto.setActive(p.getActive());
        dto.setStock(p.getStock());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }
        return dto;
    }
}
