package com.finance.outbox.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finance.outbox.OutboxEvent;

import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    // Lấy tối đa 50 event chưa gửi để publisher xử lý
    List<OutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(String status);
}