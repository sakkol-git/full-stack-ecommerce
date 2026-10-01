// ─── ANGULAR SERVICE: ProductService ─────────────────────────────────────────
// Equivalent React:   /src/services/product.service.ts (uses native fetch)
// Equivalent Vue:     /src/services/product.service.ts (uses native fetch)
//
// Angular uses HttpClient (from @angular/common/http) instead of native fetch.
// HttpClient returns Observables — Angular's reactive primitive (from RxJS).
// We expose Promise-based methods (via firstValueFrom) for a simpler, consistent API.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Product, CreateProductPayload } from '../types/product';

const BASE_URL = 'http://localhost:8080/api';

/**
 * @Injectable({ providedIn: 'root' }) — makes this a singleton service, available
 * throughout the entire app without registering it in a module's providers array.
 *
 * React equivalent:    A plain exported object (productService)
 * Vue equivalent:      A plain exported object (productService)
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  // inject() is the modern Angular DI approach (replaces constructor injection)
  // React equivalent:    N/A (no DI; services are plain imports)
  // Vue equivalent:      N/A (no DI; services are plain imports)
  private readonly http = inject(HttpClient);

  // ─── READ ──────────────────────────────────────────────────────────────────

  /** GET /api/products → Promise<Product[]> */
  getAll(): Promise<Product[]> {
    // http.get() returns an Observable; firstValueFrom converts it to a Promise
    return firstValueFrom(this.http.get<Product[]>(`${BASE_URL}/products`));
  }

  /** GET /api/products/:id → Promise<Product> */
  getById(id: number): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${BASE_URL}/products/${id}`));
  }

  // ─── WRITE ─────────────────────────────────────────────────────────────────

  /** POST /api/products → Promise<Product> (201 Created) */
  create(payload: CreateProductPayload): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(`${BASE_URL}/products`, payload));
  }

  /** PUT /api/products/:id → Promise<Product> (200 OK) */
  update(id: number, payload: CreateProductPayload): Promise<Product> {
    return firstValueFrom(this.http.put<Product>(`${BASE_URL}/products/${id}`, payload));
  }

  /** DELETE /api/products/:id → Promise<void> (204 No Content) */
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/products/${id}`));
  }
}
