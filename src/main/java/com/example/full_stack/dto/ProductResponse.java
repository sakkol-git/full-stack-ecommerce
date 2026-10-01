package com.example.full_stack.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Outbound DTO – what the API sends back to the client.
 * Never exposes the raw JPA entity; protects internal structure.
 */
public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String image,
        Instant createdAt,
        Instant updatedAt
) {}
