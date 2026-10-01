// ─── VUE TYPES ────────────────────────────────────────────────────────────────
// Equivalent React:   /src/types/product.ts (identical)
// Equivalent Angular: /src/types/product.ts (identical)
// All three frameworks share the exact same TypeScript interface definitions.

/**
 * The full Product object returned from the API (GET / POST / PUT response).
 * Maps 1:1 to the backend ProductResponse Java record.
 */
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  createdAt: string  // ISO-8601 timestamp string
  updatedAt: string
}

/**
 * Payload sent to the API when creating or updating a product.
 * Maps 1:1 to the backend ProductRequest Java record.
 * No `id` — the server assigns it.
 */
export interface CreateProductPayload {
  name: string
  description: string
  price: number
  image: string
}
