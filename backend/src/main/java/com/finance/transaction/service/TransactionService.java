package com.finance.transaction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.auth.entity.User;
import com.finance.auth.repository.UserRepository;
import com.finance.auth.util.SecurityUtils;
import com.finance.category.entity.UserCategory;
import com.finance.category.repository.UserCategoryRepository;
import com.finance.transaction.dto.TransactionMapper;
import com.finance.transaction.dto.TransactionRequest;
import com.finance.transaction.dto.TransactionResponse;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;
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
		transaction
				.setPaymentMethod(transactionRequest.getPaymentMethod() != null ? transactionRequest.getPaymentMethod()
						: PaymentMethod.CASH);
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

	@Transactional(readOnly = true)
	public TransactionResponse getTransactionById(Long id) {
		Transaction transaction = transactionRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
		return TransactionMapper.toResponse(transaction);
	}

	@Transactional(readOnly = true)
	public List<TransactionResponse> getUserTransactions() {
		User user = SecurityUtils.getCurrentUser();
		return transactionRepository.findByUserId(user.getId()).stream().map(TransactionMapper::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional
	public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
		Transaction transaction = transactionRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));

		// chỉ update các field có thay đổi
		transaction.setAmount(request.getAmount());
		transaction.setType(request.getType());
		transaction.setPaymentMethod(
				request.getPaymentMethod() != null ? request.getPaymentMethod() : transaction.getPaymentMethod());
		transaction.setNote(request.getNote());
		transaction.setTransactionDate(
				request.getTransactionDate() != null ? request.getTransactionDate() : transaction.getTransactionDate());

		// Recurring
		transaction.setRecurring(request.isRecurring());
		transaction.setActiveRecurring(request.isActiveRecurring());
		transaction.setFrequency(request.getFrequency());
		transaction.setStartDate(request.getStartDate());
		transaction.setEndDate(request.getEndDate());
		transaction.setNextRunTime(request.getNextRunTime());

		return TransactionMapper.toResponse(transactionRepository.save(transaction));
	}

	@Transactional
	public void deleteTransaction(Long id) {
		if (!transactionRepository.existsById(id)) {
			throw new RuntimeException("Transaction not found with id " + id);
		}
		transactionRepository.deleteById(id);
	}

}
