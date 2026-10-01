package com.example.full_stack.controller;

import com.example.full_stack.dto.ProductRequest;
import com.example.full_stack.dto.ProductResponse;
import com.example.full_stack.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller – thin layer; delegates all logic to ProductService.
 * Rule: Controllers must NOT contain business logic.
 *
 * CORS: Allows all three frontends (ports 5173, 4200, 3000).
 * Adjust origins to match your deployment domains in production.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {
        "http://localhost:5173",   // React (Vite dev server)
        "http://localhost:5174",   // Vue  (Vite dev server – secondary port)
        "http://localhost:4200"    // Angular (ng serve default)
})
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "CRUD operations for the product catalog")
public class ProductController {

    private final ProductService productService;

    // ─── GET ALL ─────────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns the full product catalog")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // ─── GET ONE ─────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Get product by id")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request   // @Valid triggers Bean Validation
    ) {
        var created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);   // 201 Created
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(request, id));   // 200 OK
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();   // 204 No Content
    }
}
