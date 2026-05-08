package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrueOrderByNameAsc(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrueOrderByNameAsc(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchByNameOrDescription(@Param("query") String query, Pageable pageable);

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
}
