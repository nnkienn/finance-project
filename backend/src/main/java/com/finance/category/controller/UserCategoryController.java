package com.finance.category.controller;

import com.finance.category.dto.UserCategoryRequest;
import com.finance.category.entity.CategoryType;
import com.finance.category.response.UserCategoryResponse;
import com.finance.category.service.UserCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-categories")
@RequiredArgsConstructor
public class UserCategoryController {

    private final UserCategoryService service;

    // 🔹 Tạo mới
    @PostMapping
    public ResponseEntity<UserCategoryResponse> create(@Valid @RequestBody UserCategoryRequest request) {
        return ResponseEntity.ok(service.createUserCategory(request));
    }

    // 🔹 Lấy tất cả
    @GetMapping
    public ResponseEntity<List<UserCategoryResponse>> getAll() {
        return ResponseEntity.ok(service.findAllCategoryByUser());
    }

    // 🔹 Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<UserCategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserCategoryRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    // 🔹 Xoá
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Lọc theo type
    @GetMapping("/filter")
    public ResponseEntity<List<UserCategoryResponse>> filterByType(@RequestParam CategoryType type) {
        return ResponseEntity.ok(service.getByUserAndType(type));
    }

    // 🔹 Search theo tên
    @GetMapping("/search")
    public ResponseEntity<List<UserCategoryResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(service.searchByName(keyword));
    }

    // 🔹 Copy mặc định từ master
    @PostMapping("/import-default")
    public ResponseEntity<Void> importDefault() {
        service.copyDefaultCategories();
        return ResponseEntity.noContent().build();
    }
}
