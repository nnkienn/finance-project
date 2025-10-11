package com.finance.saving.repository;

import com.finance.saving.entity.SavingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingHistoryRepository extends JpaRepository<SavingHistory, Long> {
    List<SavingHistory> findBySavingGoalIdOrderByTimestampAsc(Long savingGoalId);
}
