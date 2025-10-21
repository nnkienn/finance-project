package com.finance.notification.kafka.sender;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationSenderFactory {

	private final List<NotificationSender> senders;

	public NotificationSender getSender(String channel) {
		return senders.stream().filter(s -> s.getChannel().equalsIgnoreCase(channel)).findFirst().orElse(null);
	}
}
