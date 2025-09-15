package com.finance.transaction.service;

import org.springframework.stereotype.Service;

import com.finance.auth.entity.User;
import com.finance.auth.repository.UserRepository;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.transaction.dto.TransactionMapper;
import com.finance.transaction.dto.TransactionRequest;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;import com.finance.transaction.entity.TransactionType;
import com.finance.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
	private final TransactionRepository transactionRepository;
	private final UserRepository userRepository;
	private final UserCategoryRepository userCategoryRepository;

	public TransactionResponse createTransaction(TransactionRequest transactionRequest) {
		User user = SecurityUtils.getCurrentUser();

		UserCategory userCategory = userCategoryRepository.findById(transactionRequest.getUserCategoryId()).orElseThrow(
				() -> new RuntimeException("User not found with" + transactionRequest.getUserCategoryId()));
		
		Transaction transaction = new Transaction();
		transaction.setAmount(transactionRequest.getAmount());
		transaction.setType(transactionRequest.getType());
		transaction.setPaymentMethod(transactionRequest.getPaymentMethod()!= null ? transactionRequest.getPaymentMethod() : PaymentMethod.CASH);
		transaction.setNote(transactionRequest.getNote());
		transaction.setTransactionDate(transactionRequest.getTransactionDate());
		transaction.setUser(user);
		transaction.setUserCategory(userCategory);

        // Recurring
		transaction.setRecurring(transactionRequest.isRecurring());
		transaction.setActiveRecurring(transactionRequest.isActiveRecurring());
		transaction.setFrequency(transactionRequest.getFrequency());
		transaction.setStartDate(transactionRequest.getStartDate());
		transaction.setEndDate(transactionRequest.getEndDate());
		transaction.setNextRunTime(transactionRequest.getNextRunTime());
		
		Transaction saved = transactionRepository.save(transaction);
		return TransactionMapper.toResponse(saved);
	}

}
