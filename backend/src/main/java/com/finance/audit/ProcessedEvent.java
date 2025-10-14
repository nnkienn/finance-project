package com.finance.audit;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "processed_event")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProcessedEvent {

    @Id
    @Column(name = "event_id", length = 200)
    private String eventId;

    private String topic;

    private Integer partition;

    @Column(name = "offset_value") // ✅ rename cột tránh reserved word
    private Long offset;

    @Column(name = "processed_at")
    private Instant processedAt = Instant.now();

    public ProcessedEvent(String eventId, String topic, Integer partition, Long offset) {
        this.eventId = eventId;
        this.topic = topic;
        this.partition = partition;
        this.offset = offset;
    }
}
