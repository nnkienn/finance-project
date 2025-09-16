package com.finance.transaction.entity;

import com.finance.auth.entity.User;
import com.finance.category.entity.UserCategory;
import com.finance.transaction.entity.PaymentMethod;
import com.finance.transaction.entity.Transaction;
import com.finance.transaction.entity.TransactionType;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TransactionSpecification {

    public static Specification<Transaction> withFilters(User user,
                                                         LocalDateTime startDate,
                                                         LocalDateTime endDate,
                                                         TransactionType type,
                                                         UserCategory category,
                                                         PaymentMethod method) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Bắt buộc filter theo user
            predicates.add(cb.equal(root.get("user"), user));

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("transactionDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("transactionDate"), endDate));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (category != null) {
                predicates.add(cb.equal(root.get("userCategory"), category));
            }
            if (method != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), method));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}