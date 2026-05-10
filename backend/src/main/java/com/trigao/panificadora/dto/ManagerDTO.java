package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.User;
import lombok.Data;

@Data
public class ManagerDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Long storeId;
    private String storeName;

    public static ManagerDTO from(User u) {
        ManagerDTO dto = new ManagerDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setPhone(u.getPhone());
        if (u.getStore() != null) {
            dto.setStoreId(u.getStore().getId());
            dto.setStoreName(u.getStore().getName());
        }
        return dto;
    }
}
