package com.finance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // FE sẽ connect tới endpoint này
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cho phép mọi domain (dev)
                .withSockJS(); // Cho phép fallback khi WS không hỗ trợ
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Cho phép backend publish tới các topic dạng /topic/*
        registry.enableSimpleBroker("/topic");

        // Các message gửi từ FE phải prefix /app
        registry.setApplicationDestinationPrefixes("/app");
    }
}
