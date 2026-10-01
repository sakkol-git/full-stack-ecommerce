// ─── REACT API CLIENT ────────────────────────────────────────────────────────
// Equivalent Vue:     /src/services/apiClient.ts (identical logic)
// Equivalent Angular: Replaced by Angular's HttpClient (injected in service)

import type { Product, CreateProductPayload } from '../types/product';

const BASE_URL = 'http://localhost:8080/api';

/**
 * Generic HTTP wrapper using the native Fetch API.
 * Centralises error handling: if the server returns a non-2xx status,
 * it parses the RFC 7807 ProblemDetail body and throws a descriptive error.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    // Parse RFC 7807 ProblemDetail from the backend's GlobalExceptionHandler
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.detail ?? `HTTP ${response.status}: ${response.statusText}`);
  }

  // 204 No Content (DELETE) has no body → return undefined cast as T
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ─── PRODUCT SERVICE ──────────────────────────────────────────────────────────

export const productService = {
  /** GET /api/products → Product[] */
  getAll(): Promise<Product[]> {
    return request<Product[]>('/products');
  },

  /** GET /api/products/:id → Product */
  getById(id: number): Promise<Product> {
    return request<Product>(`/products/${id}`);
  },

  /** POST /api/products → Product (201 Created) */
  create(payload: CreateProductPayload): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** PUT /api/products/:id → Product (200 OK) */
  update(id: number, payload: CreateProductPayload): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /** DELETE /api/products/:id → void (204 No Content) */
  delete(id: number): Promise<void> {
    return request<void>(`/products/${id}`, { method: 'DELETE' });
  },
};
