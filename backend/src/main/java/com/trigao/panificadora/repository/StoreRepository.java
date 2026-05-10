package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByActiveTrueOrderByName();
    List<Store> findAllByOrderByName();
    Optional<Store> findBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
    boolean existsBySlug(String slug);
}
