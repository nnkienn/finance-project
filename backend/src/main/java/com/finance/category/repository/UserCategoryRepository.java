package com.finance.category.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.auth.entity.User;
import com.finance.category.entity.MasterCategory;
import com.finance.category.entity.UserCategory;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {
	// Lấy tất cả category theo user
	List<UserCategory> findByUser(User user);

	// Lấy tất cả category theo user + master category
	List<UserCategory> findByUserAndMasterCategory(User user, MasterCategory masterCategory);

	// Kiểm tra user đã có category với tên này chưa
	boolean existsByUserAndName(User user, String name);

	// Tìm category theo user và tên (để search nhanh)
	Optional<UserCategory> findByUserAndName(User user, String name);

	Optional<UserCategory> findByIdAndUserId(Long id, Long userId);

	@Query("""
			    SELECT uc.masterCategory.type, COUNT(uc)
			    FROM UserCategory uc
			    WHERE uc.user.id = :userId
			    GROUP BY uc.masterCategory.type
			""")
	List<Object[]> countUserCategoriesByType(@Param("userId") Long userId);
}
