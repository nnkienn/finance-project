package com.finance.category.entity;

import java.util.ArrayList;
import java.util.List;

import com.finance.auth.entity.User;
import com.finance.transaction.entity.Transaction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "user_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCategory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false , length = 100)
	private String name;
	
	private String icon;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
	private User user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name ="masterCategory_id", nullable = false)
	private MasterCategory masterCategory;
	
	@OneToMany(mappedBy = "userCategory" , cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Transaction> transactions = new ArrayList<>();
}
