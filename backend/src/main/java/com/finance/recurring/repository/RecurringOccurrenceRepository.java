package com.finance.recurring.repository;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.auth.entity.User;
import com.finance.recurring.entity.RecurringOccurrence;
import com.finance.recurring.entity.RecurringStatus;
import com.finance.recurring.entity.RecurringTemplate;

public interface RecurringOccurrenceRepository extends JpaRepository<RecurringOccurrence, Long>{

    // ====== DUE LIST (cho “Sắp tới”, Autopay) ======
    @Query("""
        SELECT o FROM RecurringOccurrence o
        WHERE o.template.user = :user
          AND o.status = com.finance.recurring.entity.RecurringStatus.PLANNED
          AND o.occurrenceAt <= :now
        ORDER BY o.occurrenceAt ASC
    """)
    List<RecurringOccurrence> findDueByUser(@Param("user") User user,
                                            @Param("now") LocalDateTime now);

    // DUE nhưng phân trang (nếu cần hiển thị nhiều)
    @Query("""
        SELECT o FROM RecurringOccurrence o
        WHERE o.template.user = :user
          AND o.status = com.finance.recurring.entity.RecurringStatus.PLANNED
          AND o.occurrenceAt <= :now
        ORDER BY o.occurrenceAt ASC
    """)
    List<RecurringOccurrence> findDueByUser(@Param("user") User user,
                                            @Param("now") LocalDateTime now,
                                            Pageable pageable);

    // ====== BY TEMPLATE ======
    List<RecurringOccurrence> findByTemplateOrderByOccurrenceAtAsc(RecurringTemplate template);

    @Query("""
        SELECT o FROM RecurringOccurrence o
        WHERE o.template = :template
          AND o.status IN :statuses
        ORDER BY o.occurrenceAt ASC
    """)
    List<RecurringOccurrence> findByTemplateAndStatuses(@Param("template") RecurringTemplate template,
                                                        @Param("statuses") List<RecurringStatus> statuses);

    // Lấy occurrence gần nhất sau một thời điểm (tiện kiểm tra sinh kỳ)
    @Query("""
        SELECT o FROM RecurringOccurrence o
        WHERE o.template = :template
          AND o.occurrenceAt > :from
        ORDER BY o.occurrenceAt ASC
    """)
    List<RecurringOccurrence> findNextOccurrences(@Param("template") RecurringTemplate template,
                                                  @Param("from") LocalDateTime from,
                                                  Pageable pageable);

    // ====== TRACE NGƯỢC TỪ TRANSACTION ======
    Optional<RecurringOccurrence> findByPostedTransactionId(Long postedTransactionId);

    // ====== THỐNG KÊ NHANH ======
    @Query("""
        SELECT COUNT(o) FROM RecurringOccurrence o
        WHERE o.template.user = :user
          AND o.status = :status
          AND o.occurrenceAt BETWEEN :start AND :end
    """)
    long countByUserAndStatusBetween(@Param("user") User user,
                                     @Param("status") RecurringStatus status,
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

    // Kiểm tra idempotent: đã có occurrence cho (template, occurrenceAt) chưa (DB đã unique, nhưng check trước để đẹp service)
    boolean existsByTemplateIdAndOccurrenceAt(Long templateId, LocalDateTime occurrenceAt);

}
