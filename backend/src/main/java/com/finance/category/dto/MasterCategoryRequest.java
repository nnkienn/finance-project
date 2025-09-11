package com.finance.category.dto;

import com.finance.category.entity.CategoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MasterCategoryRequest {
	@NotBlank(message = "Name is required")
	private String name;

	@NotNull(message = "Type is required")
	private CategoryType type;

	private String icon;

}
