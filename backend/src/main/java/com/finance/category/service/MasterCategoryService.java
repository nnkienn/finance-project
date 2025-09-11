package com.finance.category.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.finance.category.dto.MasterCategoryRequest;
import com.finance.category.entity.CategoryType;
import com.finance.category.entity.MasterCategory;
import com.finance.category.repository.MasterCategoryRepository;
import com.finance.category.response.MasterCategoryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MasterCategoryService {
	private final MasterCategoryRepository categoryRepository;

	// Lấy tất cả
	public List<MasterCategoryResponse> findAll() {
		return this.categoryRepository.findAll().stream()
				.map(cat -> new MasterCategoryResponse(cat.getId(), cat.getName(), cat.getType(), cat.getIcon()))
				.collect(Collectors.toList());
	}

	// Lấy theo type
	public List<MasterCategoryResponse> findByType(CategoryType categoryType) {
		return this.categoryRepository.findByType(categoryType).stream()
				.map(cat -> new MasterCategoryResponse(cat.getId(), cat.getName(), cat.getType(), cat.getIcon()))
				.collect(Collectors.toList());
	}

	// Lấy chi tiết
	public MasterCategoryResponse getById(Long id) {
		MasterCategory category = this.categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("MasterCategory not found with id: " + id));
		return new MasterCategoryResponse(category.getId(), category.getName(), category.getType(), category.getIcon());
	}

	// Tạo mới
	public MasterCategoryResponse create(MasterCategoryRequest categoryDto) {
		if (this.categoryRepository.existsByName(categoryDto.getName())) {
			throw new RuntimeException("Category name already exists");
		}
		MasterCategory masterCategory = new MasterCategory();
		masterCategory.setName(categoryDto.getName());
		masterCategory.setIcon(categoryDto.getIcon());
		masterCategory.setType(categoryDto.getType());

		MasterCategory saved = this.categoryRepository.save(masterCategory);
		return new MasterCategoryResponse(saved.getId(), saved.getName(), saved.getType(), saved.getIcon());
	}

	// Cập nhật
	public MasterCategoryResponse update(Long id, MasterCategoryRequest categoryDto) {
		MasterCategory existing = this.categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("MasterCategory not found with id: " + id));

		existing.setName(categoryDto.getName());
		existing.setIcon(categoryDto.getIcon());
		existing.setType(categoryDto.getType());

		MasterCategory saved = this.categoryRepository.save(existing);
		return new MasterCategoryResponse(saved.getId(), saved.getName(), saved.getType(), saved.getIcon());
	}

	// Xoá
	public void delete(Long id) {
		if (!this.categoryRepository.existsById(id)) {
			throw new RuntimeException("MasterCategory not found with id: " + id);
		}
		this.categoryRepository.deleteById(id);
	}

}
