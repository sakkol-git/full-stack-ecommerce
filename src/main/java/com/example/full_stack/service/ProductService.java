package com.example.full_stack.service;

import com.example.full_stack.dto.ProductRequest;
import com.example.full_stack.dto.ProductResponse;
import com.example.full_stack.mapper.ProductMapper;
import com.example.full_stack.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public List<ProductResponse> getAllProducts() {
        var products = productRepository.findAll();
        return products.stream().map(productMapper::toProductResponse).toList();
    }

    public ProductResponse createProduct(ProductRequest request) {
        var product = productMapper.toProduct(request);
       return productMapper.toProductResponse(productRepository.save(product));
    }
}
