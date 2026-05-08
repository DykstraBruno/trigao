package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.ProductDTO;
import com.trigao.panificadora.model.Category;
import com.trigao.panificadora.model.Product;
import com.trigao.panificadora.repository.CategoryRepository;
import com.trigao.panificadora.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDTO> findAll(Pageable pageable) {
        return productRepository.findByActiveTrueOrderByNameAsc(pageable).map(ProductDTO::from);
    }

    public Page<ProductDTO> findByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrueOrderByNameAsc(categoryId, pageable).map(ProductDTO::from);
    }

    public Page<ProductDTO> search(String query, Pageable pageable) {
        return productRepository.searchByNameOrDescription(query, pageable).map(ProductDTO::from);
    }

    public ProductDTO findById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getActive)
                .map(ProductDTO::from)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        Product product = new Product();
        fillProduct(product, dto);
        return ProductDTO.from(productRepository.save(product));
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        fillProduct(product, dto);
        return ProductDTO.from(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        product.setActive(false);
        productRepository.save(product);
    }

    private void fillProduct(Product product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());
        if (dto.getActive() != null) product.setActive(dto.getActive());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
            product.setCategory(cat);
        }
    }
}
