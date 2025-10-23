// src/main/java/com/finance/config/CloudinaryConfig.java
package com.finance.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary(@Value("${CLOUDINARY_URL}") String url) {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("CLOUDINARY_URL is missing");
        }
        return new Cloudinary(url);
    }
}
