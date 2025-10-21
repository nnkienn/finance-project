package com.finance.saving.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.notification.kafka.NotificationEventPublisher;
import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.saving.entity.SavingGoal;
import com.finance.saving.entity.SavingGoalStatus;
import com.finance.saving.repository.SavingGoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class SavingGoalExpirationScheduler {

	private final SavingGoalRepository savingGoalRepository;
	private final NotificationEventPublisher notificationEventPublisher;
	private final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * Chạy mỗi sáng lúc 7:00 để check goal hết hạn
	 */
	@Scheduled(cron = "0 0 7 * * *", zone = "Asia/Ho_Chi_Minh")
	public void checkExpiredGoals() {
		LocalDate today = LocalDate.now();

		// Lấy tất cả goal đang active mà endDate < hôm nay
		List<SavingGoal> expiredGoals = savingGoalRepository.findAll().stream()
				.filter(g -> g.getStatus() == SavingGoalStatus.IN_PROGRESS && g.getEndDate() != null
						&& g.getEndDate().isBefore(today))
				.toList();

		if (expiredGoals.isEmpty())
			return;

		log.info("🔍 Found {} expired saving goals", expiredGoals.size());

		for (SavingGoal goal : expiredGoals) {
			try {
				var payload = objectMapper.valueToTree(Map.of("goalId", goal.getId(), "goalName", goal.getName(),
						"endDate", goal.getEndDate().toString()));

				// Gửi EMAIL
				notificationEventPublisher.publish(NotificationEventDTO.builder().userId(goal.getUser().getId())
						.type("saving.expired").title("Mục tiêu tiết kiệm đã hết hạn")
						.body("Mục tiêu \"" + goal.getName() + "\" đã hết hạn vào ngày " + goal.getEndDate())
						.payload(payload).channel("EMAIL").build());

				// Gửi IN_APP
				notificationEventPublisher.publish(NotificationEventDTO.builder().userId(goal.getUser().getId())
						.type("saving.expired").title("Mục tiêu \"" + goal.getName() + "\" đã hết hạn")
						.body("Hãy xem lại tiến độ tiết kiệm của bạn.").payload(payload).channel("IN_APP").build());

				goal.setStatus(SavingGoalStatus.CANCELLED);
				savingGoalRepository.save(goal);

			} catch (Exception e) {
				log.error("❌ Failed to process expired goal id={} - {}", goal.getId(), e.getMessage(), e);
			}
		}
	}
}
