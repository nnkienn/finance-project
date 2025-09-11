package com.finance.category.entity;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "master_categories")
@Setter @Getter
@NoArgsConstructor @AllArgsConstructor
public class MasterCategory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true , length = 100)
	private String name;
	
	@Enumerated(EnumType.STRING)
	private CategoryType type;
	
	@Column(length = 255)
	private String icon;
	
	@OneToMany(mappedBy = "masterCategory", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<UserCategory> userCategories = new ArrayList<>();

}
