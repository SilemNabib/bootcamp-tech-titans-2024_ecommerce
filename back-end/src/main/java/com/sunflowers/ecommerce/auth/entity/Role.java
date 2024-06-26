package com.sunflowers.ecommerce.auth.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sunflowers.ecommerce.auth.entity.Permission.ADMIN_READ;
import static com.sunflowers.ecommerce.auth.entity.Permission.ADMIN_UPDATE;
import static com.sunflowers.ecommerce.auth.entity.Permission.ADMIN_DELETE;
import static com.sunflowers.ecommerce.auth.entity.Permission.ADMIN_CREATE;
import static com.sunflowers.ecommerce.auth.entity.Permission.USER_READ;
import static com.sunflowers.ecommerce.auth.entity.Permission.USER_UPDATE;
import static com.sunflowers.ecommerce.auth.entity.Permission.USER_DELETE;
import static com.sunflowers.ecommerce.auth.entity.Permission.USER_CREATE;

/**
 * Enum representing user roles in the system.
 * ADMIN: a user with administrative privileges
 * USER: a regular customer
 */
@RequiredArgsConstructor
public enum Role {

    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE,
                    USER_READ,
                    USER_UPDATE,
                    USER_DELETE,
                    USER_CREATE
            )
    ),
    USER(
            Set.of(
                    USER_READ,
                    USER_UPDATE,
                    USER_DELETE,
                    USER_CREATE
            )
    )

    ;

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
