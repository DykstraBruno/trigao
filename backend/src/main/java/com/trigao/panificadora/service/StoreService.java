package com.trigao.panificadora.service;

import com.trigao.panificadora.dto.StoreDTO;
import com.trigao.panificadora.model.Store;
import com.trigao.panificadora.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    public List<StoreDTO> findAll(boolean includeInactive) {
        List<Store> list = includeInactive
                ? storeRepository.findAllByOrderByName()
                : storeRepository.findByActiveTrueOrderByName();
        return list.stream().map(StoreDTO::from).collect(Collectors.toList());
    }

    public StoreDTO findById(Long id) {
        return StoreDTO.from(storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada.")));
    }

    public Store getEntity(Long id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada."));
    }

    @Transactional
    public StoreDTO create(StoreDTO dto) {
        if (storeRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Já existe loja com esse nome.");
        }
        Store s = new Store();
        s.setName(dto.getName());
        s.setSlug(slugOrDerive(dto.getSlug(), dto.getName()));
        s.setAddress(dto.getAddress());
        s.setPhone(dto.getPhone());
        if (dto.getActive() != null) s.setActive(dto.getActive());
        return StoreDTO.from(storeRepository.save(s));
    }

    @Transactional
    public StoreDTO update(Long id, StoreDTO dto) {
        Store s = storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada."));
        s.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) s.setSlug(dto.getSlug());
        s.setAddress(dto.getAddress());
        s.setPhone(dto.getPhone());
        if (dto.getActive() != null) s.setActive(dto.getActive());
        return StoreDTO.from(storeRepository.save(s));
    }

    @Transactional
    public void delete(Long id) {
        Store s = storeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada."));
        s.setActive(false);
        storeRepository.save(s);
    }

    private String slugOrDerive(String slug, String name) {
        if (slug != null && !slug.isBlank()) return slug;
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized;
    }
}
