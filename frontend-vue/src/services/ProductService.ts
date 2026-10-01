import { apiClient } from '@/api/apiClient'
import type { createProductPayload, Product, updateProductPayload } from '@/types/Product.type'

export const getAllProducts = async (): Promise<Product[]> => {
  return apiClient<Product[]>('/api/products')
}

export const createProduct = async (payload: createProductPayload): Promise<Product> => {
  return apiClient<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const updateProduct = async (
  payload: updateProductPayload,
  id: number,
): Promise<Product> => {
  return apiClient<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export const deleteProduct = async (id: number): Promise<void> => {
  return apiClient<void>(`/api/products/${id}`, {
    method: 'DELETE',
  })
}
