package com.finance.category.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.category.entity.CategoryType;
import com.finance.category.entity.MasterCategory;

public interface MasterCategoryRepository extends JpaRepository<MasterCategory, Long> {
	List<MasterCategory> findByType(CategoryType categoryType);
	boolean existsByName(String name);
}
