package com.trigao.panificadora.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    CUSTOMER("ROLE_CUSTOMER"),
    ADMIN("ROLE_ADMIN");

    private final String authority;
}
