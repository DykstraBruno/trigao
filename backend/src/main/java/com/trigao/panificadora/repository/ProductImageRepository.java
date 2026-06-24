package com.trigao.panificadora.repository;

import com.trigao.panificadora.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderBySortOrderAscIdAsc(Long productId);
    void deleteByProductIdAndId(Long productId, Long id);
}
