package com.finance.recurring.entity;

public enum RecurringStatus {
	PLANNED, // kỳ dự kiến
	POSTED, // đã tạo giao dịch thật
	REVIEW, // vượt hạn mức → cần xác nhận tay
	SKIPPED, // bỏ qua kỳ này
	MISSED // quá hạn chưa xử lý (tùy cần dùng)
}