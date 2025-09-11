package com.finance.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCategoryRequest {

    @NotNull(message = "MasterCategoryId is required")
    private Long masterCategoryId;

    @NotBlank(message = "Name is required")
    private String name;

    private String icon;
}
