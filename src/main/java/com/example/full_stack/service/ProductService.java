package com.example.full_stack.service;

import com.example.full_stack.dto.ProductRequest;
import com.example.full_stack.dto.ProductResponse;
import com.example.full_stack.exception.ProductNotFoundException;
import com.example.full_stack.mapper.ProductMapper;
import com.example.full_stack.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer – contains all business logic.
 * Controllers call Service; Service calls Repository.
 * The @Transactional annotation ensures data consistency.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // default: read-only transactions (better performance)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // ─── READ ────────────────────────────────────────────────────────────────

    /**
     * Returns all products in the catalog.
     * readOnly=true (inherited from class) → no unnecessary dirty-checking.
     */
    public List<ProductResponse> getAllProducts() {
        log.info("Fetching all products");
        return productRepository.findAll()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    /**
     * Returns a single product by id, or throws ProductNotFoundException (→ 404).
     */
    public ProductResponse getProductById(Long id) {
        log.info("Fetching product id={}", id);
        return productRepository.findById(id)
                .map(productMapper::toProductResponse)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // ─── WRITE ───────────────────────────────────────────────────────────────

    /**
     * Creates a new product and returns the saved entity as a DTO.
     * @Transactional(readOnly=false) overrides the class default.
     */
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product with name='{}'", request.name());
        var product = productMapper.toProduct(request);
        var saved = productRepository.save(product);
        log.info("Product created with id={}", saved.getId());
        return productMapper.toProductResponse(saved);
    }

    /**
     * Updates an existing product.
     * Uses updateProductFromRequest to patch the managed entity in-place,
     * preserving its id and audit timestamps correctly.
     */
    @Transactional
    public ProductResponse updateProduct(ProductRequest request, Long id) {
        log.info("Updating product id={}", id);
        var product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        // In-place mutation of the managed entity — JPA dirty-checking handles the SQL UPDATE
        productMapper.updateProductFromRequest(request, product);

        // productRepository.save() is optional here because we're inside a transaction,
        // but we call it explicitly for clarity.
        var saved = productRepository.save(product);
        log.info("Product id={} updated successfully", id);
        return productMapper.toProductResponse(saved);
    }

    /**
     * Deletes a product. Throws ProductNotFoundException if the id doesn't exist.
     * Defensive check avoids silent no-ops on bad ids.
     */
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product id={}", id);
        var product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        productRepository.delete(product);
        log.info("Product id={} deleted", id);
    }
}
