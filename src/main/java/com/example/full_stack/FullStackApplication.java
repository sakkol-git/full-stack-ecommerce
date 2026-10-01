package com.example.full_stack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Application entry point.
 * @EnableJpaAuditing activates Spring Data's auditing infrastructure
 * so that @CreatedDate and @LastModifiedDate in entities are auto-populated.
 */
@SpringBootApplication
@EnableJpaAuditing
public class FullStackApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullStackApplication.class, args);
    }
}
