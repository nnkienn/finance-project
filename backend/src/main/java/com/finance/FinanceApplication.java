package com.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.finance.outbox.config.OutboxCleanupProperties;


@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties(OutboxCleanupProperties.class)
public class FinanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinanceApplication.class, args);
	}

	
}
