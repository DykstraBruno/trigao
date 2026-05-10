package com.trigao.panificadora.controller;

import com.trigao.panificadora.dto.CreateManagerRequest;
import com.trigao.panificadora.dto.ManagerDTO;
import com.trigao.panificadora.model.Role;
import com.trigao.panificadora.model.Store;
import com.trigao.panificadora.model.User;
import com.trigao.panificadora.repository.UserRepository;
import com.trigao.panificadora.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/managers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final StoreService storeService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<ManagerDTO>> list() {
        List<ManagerDTO> managers = userRepository.findByRoleOrderByName(Role.MANAGER)
                .stream().map(ManagerDTO::from).collect(Collectors.toList());
        return ResponseEntity.ok(managers);
    }

    @PostMapping
    public ResponseEntity<ManagerDTO> create(@Valid @RequestBody CreateManagerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        Store store = storeService.getEntity(request.getStoreId());
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.MANAGER);
        user.setStore(store);
        return ResponseEntity.ok(ManagerDTO.from(userRepository.save(user)));
    }

    @PatchMapping("/{id}/store/{storeId}")
    public ResponseEntity<ManagerDTO> reassign(@PathVariable Long id, @PathVariable Long storeId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        if (user.getRole() != Role.MANAGER) {
            throw new IllegalArgumentException("Usuário não é gerente.");
        }
        user.setStore(storeService.getEntity(storeId));
        return ResponseEntity.ok(ManagerDTO.from(userRepository.save(user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
        if (user.getRole() != Role.MANAGER) {
            throw new IllegalArgumentException("Usuário não é gerente.");
        }
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}
