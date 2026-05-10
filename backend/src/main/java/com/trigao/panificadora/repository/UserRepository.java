package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.Role;
import com.trigao.panificadora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleOrderByName(Role role);
}
