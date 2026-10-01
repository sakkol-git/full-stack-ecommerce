package com.example.full_stack.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown by the service layer when a product with the given id is not found.
 * @ResponseStatus maps this to HTTP 404 when used outside @ControllerAdvice.
 * (The GlobalExceptionHandler also catches this explicitly.)
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long id) {
        super("Product not found with id: " + id);
    }
}
