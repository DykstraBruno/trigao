package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Store;
import lombok.Data;

@Data
public class StoreDTO {
    private Long id;
    private String name;
    private String slug;
    private String address;
    private String phone;
    private Boolean active;

    public static StoreDTO from(Store s) {
        StoreDTO dto = new StoreDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setSlug(s.getSlug());
        dto.setAddress(s.getAddress());
        dto.setPhone(s.getPhone());
        dto.setActive(s.getActive());
        return dto;
    }
}
