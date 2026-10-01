import { apiClient } from "../../../api/apiClient";
import type { CreateProductPayload, Product } from "../types/product.types";


export function getProducts(): Promise<Product[]> {
    return apiClient<Product[]>("/api/products");
}

export function createProduct(
    payload: CreateProductPayload
): Promise<Product> {
    return apiClient<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
    })

}