package com.trigao.panificadora.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class CreateManagerRequest {
    @NotBlank @Size(max = 150)
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String password;

    @Size(max = 20)
    private String phone;

    @NotNull
    private Long storeId;
}
