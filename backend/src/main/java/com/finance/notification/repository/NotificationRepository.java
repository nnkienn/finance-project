package com.finance.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finance.notification.Notification;
import com.finance.notification.NotificationStatus;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Tìm tất cả thông báo của user (mới nhất trước)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Đếm thông báo chưa đọc
    long countByUserIdAndIsReadFalse(Long userId);
    
    List<Notification> findTop50ByStatusOrderByCreatedAtAsc(NotificationStatus status);

}