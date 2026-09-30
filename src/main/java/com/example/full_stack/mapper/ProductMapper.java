package com.example.full_stack.mapper;

import com.example.full_stack.dto.ProductRequest;
import com.example.full_stack.dto.ProductResponse;
import com.example.full_stack.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);
    ProductResponse toProductResponse(Product product);
}
