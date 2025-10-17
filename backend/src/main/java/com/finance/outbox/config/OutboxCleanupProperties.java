// com/finance/outbox/config/OutboxCleanupProperties.java
package com.finance.outbox.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app.outbox.cleanup")
public class OutboxCleanupProperties {
    private boolean enabled = true;
    private int retentionDays = 14;
    private int batchSize = 500;
    private String cron = "0 0 3 * * *";
}
