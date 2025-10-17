// com/finance/outbox/job/OutboxCleanupJob.java
package com.finance.outbox.job;

import com.finance.outbox.config.OutboxCleanupProperties;
import com.finance.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxCleanupJob {

    private final OutboxCleanupProperties props;
    private final OutboxEventRepository repo;

    @Scheduled(cron = "${app.outbox.cleanup.cron}")
    @Transactional
    public void run() {
        if (!props.isEnabled()) return;

        Instant threshold = Instant.now().minus(props.getRetentionDays(), ChronoUnit.DAYS);
        int batch = props.getBatchSize();
        int deleted = repo.deleteSuccessBefore(threshold, batch);
        if (deleted > 0) {
            log.info("🧹 Outbox cleanup: deleted={} before={}", deleted, threshold);
        }
    }
}
