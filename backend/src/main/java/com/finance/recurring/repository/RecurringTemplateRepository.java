package com.finance.recurring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.auth.entity.User;
import com.finance.recurring.entity.RecurringTemplate;

public interface RecurringTemplateRepository extends JpaRepository<RecurringTemplate, Long>{
	List<RecurringTemplate> findByUserAndActive(User user, boolean active);
	
	Optional<RecurringTemplate> findByIdAndUserId(Long id, Long userId);
	
	  // (Tuỳ chọn) Liệt kê theo category
    List<RecurringTemplate> findByUserIdAndUserCategoryIdAndActive(Long userId, Long userCategoryId, boolean active);


}
