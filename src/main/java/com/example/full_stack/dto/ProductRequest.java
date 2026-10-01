package com.example.full_stack.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Inbound DTO – what the client sends on POST / PUT.
 * Using a Java Record for immutability and conciseness.
 * Bean-Validation annotations enforce defensive input checking.
 */
public record ProductRequest(

        @NotBlank(message = "Product name must not be blank")
        @Size(max = 255, message = "Product name must not exceed 255 characters")
        String name,

        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        BigDecimal price,

        @Size(max = 1024, message = "Image URL must not exceed 1024 characters")
        String image
) {}
