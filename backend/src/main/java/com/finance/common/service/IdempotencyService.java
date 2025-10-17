// com/finance/common/service/IdempotencyService.java
package com.finance.common.service;

import com.finance.common.entity.ProcessedEvent;
import com.finance.common.id.ProcessedEventId;
import com.finance.common.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final ProcessedEventRepository repo;

    @Transactional
    public boolean tryStart(String eventType, String aggregateId) {
        try {
            repo.save(new ProcessedEvent(new ProcessedEventId(eventType, aggregateId), null));
            return true; // lần đầu thấy event → xử lý
        } catch (DataIntegrityViolationException e) {
            return false; // đã xử lý rồi → bỏ qua
        }
    }
}
