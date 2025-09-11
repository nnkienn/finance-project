package com.finance.category.response;

import com.finance.category.entity.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MasterCategoryResponse {
    private Long id;
    private String name;
    private CategoryType type;
    private String icon;
}