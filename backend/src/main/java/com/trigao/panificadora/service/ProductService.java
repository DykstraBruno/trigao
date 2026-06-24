package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.ProductDTO;
import com.trigao.panificadora.dto.ProductImageDTO;
import com.trigao.panificadora.model.Category;
import com.trigao.panificadora.model.Product;
import com.trigao.panificadora.model.ProductImage;
import com.trigao.panificadora.repository.CategoryRepository;
import com.trigao.panificadora.repository.ProductImageRepository;
import com.trigao.panificadora.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository imageRepository;

    public Page<ProductDTO> findAll(Pageable pageable) {
        return productRepository.findByActiveTrueOrderByNameAsc(pageable).map(this::toDto);
    }

    public Page<ProductDTO> findByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrueOrderByNameAsc(categoryId, pageable).map(this::toDto);
    }

    public Page<ProductDTO> search(String query, Pageable pageable) {
        return productRepository.searchByNameOrDescription(query, pageable).map(this::toDto);
    }

    public Page<ProductDTO> filter(Long categoryId, String query,
                                   BigDecimal minPrice, BigDecimal maxPrice,
                                   boolean inStockOnly, Pageable pageable) {
        String q = (query == null || query.isBlank()) ? null : query.trim();
        return productRepository
                .filter(categoryId, q, minPrice, maxPrice, inStockOnly, pageable)
                .map(this::toDto);
    }

    public ProductDTO findById(Long id) {
        Product p = productRepository.findById(id)
                .filter(Product::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        return toDto(p);
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        Product product = new Product();
        fillProduct(product, dto);
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        fillProduct(product, dto);
        return toDto(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        product.setActive(false);
        productRepository.save(product);
    }

    // Image management

    public List<ProductImageDTO> listImages(Long productId) {
        return imageRepository.findByProductIdOrderBySortOrderAscIdAsc(productId)
                .stream().map(ProductImageDTO::from).collect(Collectors.toList());
    }

    @Transactional
    public ProductImageDTO addImage(Long productId, ProductImageDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        ProductImage img = new ProductImage();
        img.setProduct(product);
        img.setUrl(dto.getUrl());
        img.setAltText(dto.getAltText());
        img.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        return ProductImageDTO.from(imageRepository.save(img));
    }

    @Transactional
    public ProductImageDTO updateImage(Long productId, Long imageId, ProductImageDTO dto) {
        ProductImage img = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Imagem não encontrada."));
        if (img.getProduct() == null || !img.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Imagem não pertence ao produto.");
        }
        if (dto.getUrl() != null && !dto.getUrl().isBlank()) img.setUrl(dto.getUrl());
        if (dto.getAltText() != null) img.setAltText(dto.getAltText());
        if (dto.getSortOrder() != null) img.setSortOrder(dto.getSortOrder());
        return ProductImageDTO.from(imageRepository.save(img));
    }

    @Transactional
    public void deleteImage(Long productId, Long imageId) {
        ProductImage img = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Imagem não encontrada."));
        if (img.getProduct() == null || !img.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Imagem não pertence ao produto.");
        }
        imageRepository.delete(img);
    }

    private ProductDTO toDto(Product p) {
        List<ProductImage> imgs = imageRepository.findByProductIdOrderBySortOrderAscIdAsc(p.getId());
        return ProductDTO.from(p, imgs);
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
