package com.finance.notification.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.auth.entity.User;
import com.finance.auth.util.SecurityUtils;
import com.finance.notification.Notification;
import com.finance.notification.dto.NotificationResponse;
import com.finance.notification.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    // 🔹 Lấy tất cả thông báo của user hiện tại
    @GetMapping
    public List<NotificationResponse> list() {
        User user = SecurityUtils.getCurrentUser();
        Long userId = user.getId();

        return repo.findByUserIdOrderByCreatedAtDesc(userId)
                   .stream()
                   .map(NotificationResponse::fromEntity)
                   .toList();
    }

    // 🔹 Đánh dấu 1 thông báo là đã đọc
    @PatchMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable Long id) {
        Notification notif = repo.findById(id).orElseThrow();
        notif.setRead(true);
        repo.save(notif);
        return NotificationResponse.fromEntity(notif);
    }

    // 🔹 Đánh dấu tất cả thông báo là đã đọc
    @PatchMapping("/read-all")
    public List<NotificationResponse> markAllRead() {
        User user = SecurityUtils.getCurrentUser();
        Long userId = user.getId();

        List<Notification> notifs = repo.findByUserIdOrderByCreatedAtDesc(userId);
        notifs.forEach(n -> n.setRead(true));
        repo.saveAll(notifs);

        return notifs.stream()
                     .map(NotificationResponse::fromEntity)
                     .toList();
    }
}
