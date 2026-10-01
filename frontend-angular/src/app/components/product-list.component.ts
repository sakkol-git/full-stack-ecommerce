// ─── ANGULAR DUMB COMPONENT: ProductListComponent ────────────────────────────
// Pattern: Presentational / Dumb Component — renders a list, emits events.
// NO API calls, NO service injection here.
//
// React Equivalent:  function ProductList({ products, isLoading, onEdit, onDelete })
// Vue Equivalent:    defineProps() + defineEmits()

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from '../types/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  // ─── @Input: props flowing DOWN from the parent ───────────────────────────
  // React equivalent:    products: Product[]  (destructured from props)
  // Vue equivalent:      const props = defineProps<{ products: Product[] }>()
  @Input() products: Product[] = [];

  // React equivalent:    isLoading: boolean
  // Vue equivalent:      defineProps<{ isLoading: boolean }>()
  @Input() isLoading = false;

  // ─── @Output: events bubbling UP to the parent ───────────────────────────
  // React equivalent:    onEdit: (product: Product) => void  (callback prop)
  // Vue equivalent:      const emit = defineEmits<{ edit: [product: Product] }>()
  @Output() edit = new EventEmitter<Product>();

  // React equivalent:    onDelete: (id: number) => void
  // Vue equivalent:      defineEmits<{ delete: [id: number] }>()
  @Output() delete = new EventEmitter<number>();

  /** Helper for template — formats price with 2 decimal places */
  formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }

  /** Handles broken image URLs */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://placehold.co/400x200/1f2937/6366f1?text=No+Image';
  }
}
