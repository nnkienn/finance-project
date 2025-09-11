package com.finance.category.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.finance.category.dto.MasterCategoryRequest;
import com.finance.category.entity.CategoryType;
import com.finance.category.response.MasterCategoryResponse;
import com.finance.category.service.MasterCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/master-categories")
@RestController
@RequiredArgsConstructor
public class MasterCategoryController {

    private final MasterCategoryService masterCategoryService;
    
    @GetMapping
    public ResponseEntity<List<MasterCategoryResponse>> getAll(@RequestParam(required = false) CategoryType type) {
    	  if (type != null) {
              return ResponseEntity.ok(masterCategoryService.findByType(type));
          }
          return ResponseEntity.ok(masterCategoryService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MasterCategoryResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(masterCategoryService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MasterCategoryResponse> create(@Valid @RequestBody MasterCategoryRequest dto) {
        MasterCategoryResponse response = masterCategoryService.create(dto);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MasterCategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MasterCategoryRequest dto) {
        return ResponseEntity.ok(masterCategoryService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        masterCategoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
