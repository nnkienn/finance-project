package com.finance.transaction.dto;

import com.finance.transaction.entity.Transaction;

public class TransactionMapper {
    public static TransactionResponse toResponse(Transaction transaction) {
        Long savingGoalId = transaction.getSavingGoal() != null ? transaction.getSavingGoal().getId() : null;
        String savingGoalName = transaction.getSavingGoal() != null ? transaction.getSavingGoal().getName() : null;

        String categoryName = null;
        String categoryIcon = null;
        if (transaction.getUserCategory() != null) {
            try {
                categoryName = transaction.getUserCategory().getName();
                categoryIcon = transaction.getUserCategory().getIcon();
            } catch (Exception e) {
                // If we hit lazy-init or other proxy issues, fallback to null to avoid NPE
                categoryName = null;
                categoryIcon = null;
            }
        }

        Long recurringId = null;
        try {
            recurringId = transaction.getRecurringOccurrence() != null
                    ? transaction.getRecurringOccurrence().getId()
                    : null;
        } catch (Exception e) {
            recurringId = null;
        }

        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .paymentMethod(transaction.getPaymentMethod())
                .note(transaction.getNote())
                .transactionDate(transaction.getTransactionDate())
                .categoryName(categoryName)
                .categoryIcon(categoryIcon)
                .recurringOccurrenceId(recurringId)
                .savingGoalId(savingGoalId)
                .savingGoalName(savingGoalName)
                .build();
    }
}
