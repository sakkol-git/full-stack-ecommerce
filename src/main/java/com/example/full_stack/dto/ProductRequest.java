package com.example.full_stack.dto;

import java.math.BigDecimal;

public record ProductRequest(
        String name,
        String description,
        BigDecimal price,
        String image
) {
}
