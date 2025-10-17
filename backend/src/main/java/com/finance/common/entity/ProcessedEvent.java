// com/finance/common/entity/ProcessedEvent.java
package com.finance.common.entity;

import com.finance.common.id.ProcessedEventId;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "processed_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProcessedEvent {

    @EmbeddedId
    private ProcessedEventId id;

    @Column(name = "processed_at", nullable = false)
    private Instant processedAt = Instant.now();
}
