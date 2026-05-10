package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.StoreDTO;
import com.trigao.panificadora.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreDTO>> list(
            @RequestParam(defaultValue = "false") boolean includeInactive) {
        return ResponseEntity.ok(storeService.findAll(includeInactive));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreDTO> create(@Valid @RequestBody StoreDTO dto) {
        return ResponseEntity.ok(storeService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreDTO> update(@PathVariable Long id, @Valid @RequestBody StoreDTO dto) {
        return ResponseEntity.ok(storeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        storeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
