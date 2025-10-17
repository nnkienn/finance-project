package com.finance.notification.kafka.dto;


import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEventDTO {
    private Long userId;
    private String type;      // e.g. "transaction.created"
    private String title;
    private String body;
    private JsonNode payload; // extra JSON data
    private String channel;   // EMAIL, PUSH, IN_APP
}