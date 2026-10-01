// ─── VUE API CLIENT ───────────────────────────────────────────────────────────
// Equivalent React:   /src/services/product.service.ts (identical Fetch logic)
// Equivalent Angular: Replaced by Angular's HttpClient (see Angular service)

import type { Product, CreateProductPayload } from '../types/product'

const BASE_URL = 'http://localhost:8080/api'

/**
 * Generic HTTP wrapper using the native Fetch API.
 * Centralises error handling: non-2xx responses parse the RFC 7807 ProblemDetail
 * body (from the backend's GlobalExceptionHandler) and throw a descriptive error.
 *
 * This is IDENTICAL to the React service — framework-agnostic fetch logic.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))
    throw new Error(problem.detail ?? `HTTP ${response.status}: ${response.statusText}`)
  }

  // 204 No Content (DELETE) has no body
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

// ─── PRODUCT SERVICE ──────────────────────────────────────────────────────────

export const productService = {
  /** GET /api/products → Product[] */
  getAll(): Promise<Product[]> {
    return request<Product[]>('/products')
  },

  /** GET /api/products/:id → Product */
  getById(id: number): Promise<Product> {
    return request<Product>(`/products/${id}`)
  },

  /** POST /api/products → Product (201 Created) */
  create(payload: CreateProductPayload): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /** PUT /api/products/:id → Product (200 OK) */
  update(id: number, payload: CreateProductPayload): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  /** DELETE /api/products/:id → void (204 No Content) */
  delete(id: number): Promise<void> {
    return request<void>(`/products/${id}`, { method: 'DELETE' })
  },
}
