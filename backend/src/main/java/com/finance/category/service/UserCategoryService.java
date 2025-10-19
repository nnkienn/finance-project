package com.finance.category.service;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.dto.UserCategoryRequest;
import com.finance.category.entity.CategoryType;
import com.finance.category.entity.MasterCategory;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.MasterCategoryRepository;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.category.response.UserCategoryResponse;
import com.finance.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCategoryService {

	private final UserCategoryRepository userCategoryRepository;
	private final MasterCategoryRepository masterCategoryRepository;
	private final TransactionRepository transactionRepository;

	// 🔹 Tạo mới
	public UserCategoryResponse createUserCategory(UserCategoryRequest request) {
		User user = SecurityUtils.getCurrentUser();
		MasterCategory masterCategory = getMasterCategory(request.getMasterCategoryId());

		if (userCategoryRepository.existsByUserAndName(user, request.getName())) {
			throw new RuntimeException("User already has a category with name: " + request.getName());
		}

		UserCategory userCategory = new UserCategory();
		userCategory.setName(request.getName());
		userCategory.setIcon(request.getIcon());
		userCategory.setUser(user);
		userCategory.setMasterCategory(masterCategory);

		return toResponse(userCategoryRepository.save(userCategory));
	}

	// 🔹 Lấy tất cả categories của user
	public List<UserCategoryResponse> findAllCategoryByUser() {
		User user = SecurityUtils.getCurrentUser();
		return userCategoryRepository.findByUser(user).stream().map(this::toResponse).collect(Collectors.toList());
	}

	// 🔹 Cập nhật
	public UserCategoryResponse update(Long userCategoryId, UserCategoryRequest request) {
		User user = SecurityUtils.getCurrentUser();
		UserCategory existing = userCategoryRepository.findById(userCategoryId)
				.orElseThrow(() -> new RuntimeException("User category not found with id " + userCategoryId));

		if (!existing.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Not allowed to update category of another user");
		}

		if (userCategoryRepository.existsByUserAndName(user, request.getName())
				&& !existing.getName().equals(request.getName())) {
			throw new RuntimeException("Duplicate category name: " + request.getName());
		}

		existing.setName(request.getName());
		existing.setIcon(request.getIcon());

		return toResponse(userCategoryRepository.save(existing));
	}

	// 🔹 Xoá
	public void delete(Long userCategoryId) {
		User user = SecurityUtils.getCurrentUser();
		UserCategory existing = userCategoryRepository.findById(userCategoryId)
				.orElseThrow(() -> new RuntimeException("User category not found with id " + userCategoryId));

		if (!existing.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Not allowed to delete category of another user");
		}

		userCategoryRepository.delete(existing);
	}

	// 🔹 Lọc theo type
	public List<UserCategoryResponse> getByUserAndType(CategoryType type) {
		User user = SecurityUtils.getCurrentUser();
		return userCategoryRepository.findByUser(user).stream()
				.filter(c -> c.getMasterCategory().getType().equals(type)).map(this::toResponse)
				.collect(Collectors.toList());
	}

	// 🔹 Search theo tên
	public List<UserCategoryResponse> searchByName(String keyword) {
		User user = SecurityUtils.getCurrentUser();
		return userCategoryRepository.findByUser(user).stream()
				.filter(c -> c.getName().toLowerCase().contains(keyword.toLowerCase())).map(this::toResponse)
				.collect(Collectors.toList());
	}

	public List<UserCategoryResponse> findByMaster(Long masterId) {
		User user = SecurityUtils.getCurrentUser();
		MasterCategory masterCategory = this.getMasterCategory(masterId);

		return userCategoryRepository.findByUserAndMasterCategory(user, masterCategory).stream().map(this::toResponse)
				.collect(Collectors.toList());

	}

	// 🔹 Copy từ MasterCategory khi user mới đăng ký
	public void copyDefaultCategories() {
		User user = SecurityUtils.getCurrentUser();
		List<MasterCategory> masters = masterCategoryRepository.findAll();
		for (MasterCategory masterCategory : masters) {
			if (!userCategoryRepository.existsByUserAndName(user, masterCategory.getName())) {
				UserCategory userCategory = new UserCategory();
				userCategory.setUser(user);
				userCategory.setName(masterCategory.getName());
				userCategory.setIcon(masterCategory.getIcon());
				userCategory.setMasterCategory(masterCategory);
				userCategoryRepository.save(userCategory);
			}
		}
	}

	// 🔹 Thống kê (placeholder)
	public BigDecimal getTotalAmountByCategory(Long categoryId, LocalDate start, LocalDate end) {
		return BigDecimal.ZERO; // TODO: dùng TransactionRepository sau này
	}

	// Helper
	private MasterCategory getMasterCategory(Long masterCategoryId) {
		return masterCategoryRepository.findById(masterCategoryId)
				.orElseThrow(() -> new RuntimeException("MasterCategory not found with id: " + masterCategoryId));
	}

	private UserCategoryResponse toResponse(UserCategory entity) {
		return new UserCategoryResponse(entity.getId(), entity.getName(), entity.getIcon(),
				entity.getMasterCategory().getId(), entity.getMasterCategory().getName(),
				entity.getMasterCategory().getType());
	}

	// =============================
	// 🔹 1. Dashboard Summary
	// =============================
	public Map<String, Long> countCategoriesByType() {
		User user = SecurityUtils.getCurrentUser();
		List<Object[]> results = userCategoryRepository.countUserCategoriesByType(user.getId());

		Map<String, Long> counts = results.stream().collect(Collectors.toMap(r -> r[0].toString(), // CategoryType
																									// (INCOME / EXPENSE
																									// / SAVING)
				r -> (Long) r[1]));

		// Đảm bảo có đủ 3 loại (gán 0 nếu user chưa có)
		for (CategoryType type : CategoryType.values()) {
			counts.putIfAbsent(type.name(), 0L);
		}

		return counts;
	}

	// =============================
	// 🔹 2. Expenses by category
	// =============================
	public List<Map<String, Object>> getExpensesByCategory(Integer month, Integer year) {
		User user = SecurityUtils.getCurrentUser();
		LocalDate now = LocalDate.now();
		int m = (month != null) ? month : now.getMonthValue();
		int y = (year != null) ? year : now.getYear();

		List<Object[]> results = transactionRepository.sumByCategoryForUserAndMonth(CategoryType.EXPENSE, user.getId(),
				m, y);

		return results.stream().map(r -> {
			Map<String, Object> map = Map.of("name", (Object) r[0], "amount", (Object) r[1]);
			return map;
		}).collect(Collectors.toList());
	}

	// =============================
	// 🔹 3. Top expense categories
	// =============================
	public List<Map<String, Object>> getTopExpenseCategories(Integer month, Integer year, int limit) {
		List<Map<String, Object>> data = getExpensesByCategory(month, year);
		return data.stream().sorted((a, b) -> ((BigDecimal) b.get("amount")).compareTo((BigDecimal) a.get("amount")))
				.limit(limit).collect(Collectors.toList());
	}
}
