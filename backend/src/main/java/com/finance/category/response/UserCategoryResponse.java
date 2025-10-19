package com.finance.category.response;

import com.finance.category.entity.CategoryType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCategoryResponse {
	private Long id;
	private String name;
	private String icon;
	private Long masterCategoryId;
	private String masterCategoryName;
	private CategoryType categoryType;
}
