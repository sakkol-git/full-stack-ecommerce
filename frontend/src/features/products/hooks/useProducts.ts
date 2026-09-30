import { useCallback, useEffect, useState } from "react";
import { createProduct, getProducts } from "../api/productApi";
import type { CreateProductPayload, Product } from "../types/product.types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch products"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = async (payload: CreateProductPayload): Promise<Product> => {
    setIsSubmitting(true)
    try {
        const newProduct = await createProduct(payload);
        setProducts((prev) => [...prev, newProduct]);
        return newProduct
    } finally {
        setIsSubmitting(false);
    }

  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchProducts,
    addProduct,
  };
}