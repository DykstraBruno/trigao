package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.CategoryDTO;
import com.trigao.panificadora.model.Category;
import com.trigao.panificadora.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> findAll() {
        return categoryRepository.findByActiveTrue()
                .stream().map(CategoryDTO::from).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO create(CategoryDTO dto) {
        Category cat = new Category();
        cat.setName(dto.getName());
        cat.setDescription(dto.getDescription());
        cat.setImageUrl(dto.getImageUrl());
        return CategoryDTO.from(categoryRepository.save(cat));
    }

    @Transactional
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        cat.setName(dto.getName());
        cat.setDescription(dto.getDescription());
        cat.setImageUrl(dto.getImageUrl());
        if (dto.getActive() != null) cat.setActive(dto.getActive());
        return CategoryDTO.from(categoryRepository.save(cat));
    }

    @Transactional
    public void delete(Long id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        cat.setActive(false);
        categoryRepository.save(cat);
    }
}
