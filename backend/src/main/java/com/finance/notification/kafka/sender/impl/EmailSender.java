package com.finance.notification.kafka.sender.impl;

import com.finance.notification.kafka.dto.NotificationEventDTO;
import com.finance.notification.kafka.sender.NotificationSender;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailSender implements NotificationSender {

    private final JavaMailSender mailSender;

    @Override
    public String getChannel() {
        return "EMAIL";
    }

    @Override
    public void send(NotificationEventDTO event) {
        try {
            // Tạo email HTML có nút xác minh
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(event.getPayload().get("email").asText());
            helper.setSubject(event.getTitle());

            String verifyUrl = event.getPayload().get("verifyUrl").asText();

            String html = """
                    <div style="font-family:Arial,sans-serif;line-height:1.6">
                        <h3 style="color:#4CAF50;">%s</h3>
                        <p>%s</p>
                        <p>
                            <a href="https://knance.vercel.app%s"
                               style="background-color:#4CAF50;color:white;padding:10px 18px;text-decoration:none;border-radius:6px;">
                               Xác minh ngay
                            </a>
                        </p>
                        <hr>
                        <small style="color:#888">Knance Notifications</small>
                    </div>
                    """.formatted(event.getTitle(), event.getBody(), verifyUrl);

            helper.setText(html, true);
            mailSender.send(message);

            log.info("📧 Email sent successfully to {}", event.getPayload().get("email").asText());
        } catch (Exception e) {
            log.error("❌ Failed to send email: {}", e.getMessage(), e);
        }
    }
}
