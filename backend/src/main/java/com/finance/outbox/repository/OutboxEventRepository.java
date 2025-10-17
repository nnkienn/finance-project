package com.finance.outbox.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finance.outbox.OutboxEvent;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

	// Lấy 100 bản ghi chờ/ retry theo thời gian
	List<OutboxEvent> findTop100ByStatusInAndAttemptsLessThanOrderByCreatedAtAsc(Collection<String> statuses,
			int maxAttempts);

	@Modifying
	@Query("""
			  update OutboxEvent o
			     set o.status = :newStatus
			   where o.id = :id and o.status = :oldStatus
			""")
	int tryChangeStatus(@Param("id") Long id, @Param("oldStatus") String oldStatus,
			@Param("newStatus") String newStatus);


	  @Modifying
	  @Query(value = """
	      DELETE FROM outbox
	       WHERE id IN (
	         SELECT id
	           FROM outbox
	          WHERE status = 'SUCCESS'
	            AND created_at < :before
	          ORDER BY created_at
	          LIMIT :batch
	       )
	      """, nativeQuery = true)
	  int deleteSuccessBefore(@Param("before") Instant before,
	                          @Param("batch") int batch);


}