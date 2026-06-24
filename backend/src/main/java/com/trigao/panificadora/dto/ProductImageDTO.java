package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.ProductImage;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class ProductImageDTO {
    private Long id;

    @NotBlank @Size(max = 500)
    private String url;

    @Size(max = 255)
    private String altText;

    private Integer sortOrder = 0;

    public static ProductImageDTO from(ProductImage img) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setId(img.getId());
        dto.setUrl(img.getUrl());
        dto.setAltText(img.getAltText());
        dto.setSortOrder(img.getSortOrder());
        return dto;
    }
}
