package com.example.full_stack.repository;

import com.example.full_stack.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for Product.
 * Provides CRUD + pagination for free.
 * Extend with custom @Query methods as your domain grows.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // findByNameContainingIgnoreCase(String name) — ready to add when search is needed
}
