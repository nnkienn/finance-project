// com/finance/outbox/repository/OutboxMaintenanceRepository.java
package com.finance.outbox.repository;

import java.time.Instant;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface OutboxMaintenanceRepository extends Repository<com.finance.outbox.OutboxEvent, Long> {

    @Modifying
    @Transactional
    @Query(value = """
        WITH to_del AS (
          SELECT id
          FROM outbox
          WHERE status = 'SUCCESS' AND created_at < :before
          ORDER BY id
          LIMIT :batch
        )
        DELETE FROM outbox o
        USING to_del d
        WHERE o.id = d.id
        """, nativeQuery = true)
    int deleteBatchSuccessBefore(@Param("before") Instant before,
                                 @Param("batch") int batch);
}
