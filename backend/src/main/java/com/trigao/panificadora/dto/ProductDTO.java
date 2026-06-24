package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Product;
import com.trigao.panificadora.model.ProductImage;
import lombok.Data;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    private List<ProductImageDTO> images;

    public static ProductDTO from(Product p) {
        return from(p, Collections.emptyList());
    }

    public static ProductDTO from(Product p, List<ProductImage> extraImages) {
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
        dto.setImages(extraImages == null ? Collections.emptyList()
                : extraImages.stream().map(ProductImageDTO::from).collect(Collectors.toList()));
        return dto;
    }
}
