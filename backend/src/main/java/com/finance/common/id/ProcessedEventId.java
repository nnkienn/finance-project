// com/finance/common/id/ProcessedEventId.java
package com.finance.common.id;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class ProcessedEventId implements Serializable {
    private String eventType;     // vd: "transaction.created"
    private String aggregateId;   // vd: transactionId (string)
}
