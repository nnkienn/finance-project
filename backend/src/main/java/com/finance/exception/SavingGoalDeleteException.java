package com.finance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // hoặc BAD_REQUEST nếu bạn thích
public class SavingGoalDeleteException extends RuntimeException {
    public SavingGoalDeleteException(String message) {
        super(message);
    }
}
