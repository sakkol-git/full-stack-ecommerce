// ─── REACT TYPES ──────────────────────────────────────────────────────────────
// Equivalent Vue:     interface defined in /src/types/product.ts (same file)
// Equivalent Angular: interface defined in /src/types/product.ts (same file)

/**
 * The full Product object returned from the API (GET / POST / PUT response).
 * Maps 1:1 to the backend ProductResponse Java record.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;      // JSON numbers map to TypeScript number (BigDecimal → number is fine for display)
  image: string;
  createdAt: string;  // ISO-8601 timestamp string
  updatedAt: string;
}

/**
 * Payload sent to the API when creating or updating a product.
 * Maps 1:1 to the backend ProductRequest Java record.
 * No `id` field — the server assigns the id.
 */
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  image: string;
}
