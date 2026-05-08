package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Category;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CategoryDTO {

    private Long id;

    @NotBlank @Size(max = 100)
    private String name;

    private String description;
    private String imageUrl;
    private Boolean active;

    public static CategoryDTO from(Category c) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());
        dto.setImageUrl(c.getImageUrl());
        dto.setActive(c.getActive());
        return dto;
    }
}
