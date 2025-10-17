// com/finance/outbox/config/OutboxConfig.java
package com.finance.outbox.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(OutboxCleanupProperties.class)
public class OutboxConfig {}
