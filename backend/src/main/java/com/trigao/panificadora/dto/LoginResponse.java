package com.trigao.panificadora.dto;

import com.trigao.panificadora.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Long storeId;
    private String storeName;
}
