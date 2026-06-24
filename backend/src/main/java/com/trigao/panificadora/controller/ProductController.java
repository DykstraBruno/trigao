package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.ProductDTO;
import com.trigao.panificadora.dto.ProductImageDTO;
import com.trigao.panificadora.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> findAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "false") boolean inStockOnly,
            @PageableDefault(size = 12) Pageable pageable) {

        boolean hasExtraFilters = minPrice != null || maxPrice != null || inStockOnly;
        if (hasExtraFilters || (search != null && !search.isBlank() && categoryId != null)) {
            return ResponseEntity.ok(productService.filter(categoryId, search, minPrice, maxPrice, inStockOnly, pageable));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(productService.search(search, pageable));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.findByCategory(categoryId, pageable));
        }
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Imagens extras (galeria)
    @GetMapping("/{id}/images")
    public ResponseEntity<List<ProductImageDTO>> listImages(@PathVariable Long id) {
        return ResponseEntity.ok(productService.listImages(id));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductImageDTO> addImage(@PathVariable Long id, @Valid @RequestBody ProductImageDTO dto) {
        return ResponseEntity.ok(productService.addImage(id, dto));
    }

    @PutMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductImageDTO> updateImage(@PathVariable Long id,
                                                       @PathVariable Long imageId,
                                                       @RequestBody ProductImageDTO dto) {
        return ResponseEntity.ok(productService.updateImage(id, imageId, dto));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        productService.deleteImage(id, imageId);
        return ResponseEntity.noContent().build();
    }
}
