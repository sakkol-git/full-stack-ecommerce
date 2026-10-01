package com.example.full_stack.mapper;

import com.example.full_stack.dto.ProductRequest;
import com.example.full_stack.dto.ProductResponse;
import com.example.full_stack.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper – eliminates hand-written boilerplate conversions.
 * componentModel="spring" makes this a Spring bean, injectable via @Autowired / constructor injection.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {

    /**
     * Converts a ProductRequest (inbound DTO) → Product (JPA entity).
     * id / createdAt / updatedAt are managed by JPA – explicitly ignored.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ProductRequest request);

    /**
     * Updates an existing Product entity in-place from a ProductRequest.
     * This preserves the entity's id / audit timestamps during an update.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);

    /** Converts a Product (entity) → ProductResponse (outbound DTO). */
    ProductResponse toProductResponse(Product product);
}
