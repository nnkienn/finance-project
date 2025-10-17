// src/main/java/com/finance/test/MailTestController.java
package com.finance.transaction.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MailTestController {

    private final JavaMailSender mailSender;

    @GetMapping("/test-mail")
    public String testMail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("kientrungng.2002@gmail.com");
        msg.setSubject("Test Gmail Config");
        msg.setText("✅ Mail gửi thành công từ Spring Boot mới!");
        mailSender.send(msg);
        return "Mail sent!";
    }
}
