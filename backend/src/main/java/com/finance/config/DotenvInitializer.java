package com.finance.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        Properties props = new Properties();
        for (DotenvEntry e : dotenv.entries()) {
            props.put(e.getKey(), e.getValue());
        }

        ConfigurableEnvironment env = context.getEnvironment();
        env.getPropertySources().addFirst(new PropertiesPropertySource("dotenv", props));

        System.out.println("✅ Dotenv loaded early with " + props.size() + " variables");
    }
}
