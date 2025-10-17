// com/finance/common/repository/ProcessedEventRepository.java
package com.finance.common.repository;

import com.finance.common.entity.ProcessedEvent;
import com.finance.common.id.ProcessedEventId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, ProcessedEventId> {}
