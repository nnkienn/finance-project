package com.finance.transaction.port;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;

public interface RecurringPostingPort {
	Transaction postFromRecurring(User user, UserCategory category, BigDecimal amount, LocalDateTime when, String note,
			PaymentMethod method, TransactionType type);
}
