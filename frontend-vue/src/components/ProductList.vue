<script setup lang="ts">
// ─── VUE DUMB COMPONENT: ProductList ──────────────────────────────────────────
// Pattern: Presentational / Dumb Component — renders a list, emits events.
// NO API calls, NO state — all data flows in via defineProps().
//
// React Equivalent:  interface ProductListProps { products: Product[]; onEdit: ...; onDelete: ... }
// Angular Equivalent: @Input() products: Product[]; @Output() edit/delete EventEmitter

import type { Product } from '../types/product'

// ─── Props ─────────────────────────────────────────────────────────────────────
// React equivalent:    { products, isLoading, onEdit, onDelete }: ProductListProps
// Angular equivalent:  @Input() products: Product[] = []; @Input() isLoading = false;
defineProps<{
  products: Product[]
  isLoading: boolean
}>()

// ─── Emits ─────────────────────────────────────────────────────────────────────
// React equivalent:    onEdit: (product: Product) => void  (callback prop)
// Angular equivalent:  @Output() edit = new EventEmitter<Product>()
//                      @Output() delete = new EventEmitter<number>()
const emit = defineEmits<{
  edit: [product: Product]
  delete: [id: number]
}>()
</script>

<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="flex items-center justify-center py-24">
    <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    <span class="ml-4 text-lg text-gray-400">Loading catalog...</span>
  </div>

  <!-- Empty State -->
  <div
    v-else-if="products.length === 0"
    class="flex flex-col items-center justify-center py-24 text-center"
  >
    <span class="text-6xl">&#128230;</span>
    <h3 class="mt-4 text-xl font-semibold text-gray-300">No products yet</h3>
    <p class="mt-2 text-gray-500">Click "Add Product" to create your first item.</p>
  </div>

  <!-- Product Grid -->
  <!--
    Vue equivalent:    v-for="product in products" :key="product.id"
    React equivalent:  products.map((product) => <ProductCard key={product.id} ... />)
    Angular equivalent: @for (product of products; track product.id) { ... }
  -->
  <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="product in products"
      :key="product.id"
      class="group flex flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-lg ring-1 ring-white/5 transition hover:-translate-y-1 hover:shadow-indigo-500/20 hover:shadow-2xl"
    >
      <!-- Product Image -->
      <div class="relative h-48 overflow-hidden bg-gray-700">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x200/1f2937/6366f1?text=No+Image'"
        />
        <div v-else class="flex h-full items-center justify-center text-4xl text-gray-600">
          &#128444;&#65039;
        </div>
        <span class="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-sm font-bold text-white shadow-lg">
          ${{ Number(product.price).toFixed(2) }}
        </span>
      </div>

      <!-- Card Body -->
      <div class="flex flex-1 flex-col p-5">
        <h3 class="text-lg font-bold text-white">{{ product.name }}</h3>
        <p class="mt-1 line-clamp-2 flex-1 text-sm text-gray-400">
          {{ product.description || 'No description provided.' }}
        </p>
        <p class="mt-2 text-xs text-gray-600">
          Added: {{ new Date(product.createdAt).toLocaleDateString() }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 border-t border-gray-700 p-4">
        <button
          :id="`edit-product-${product.id}`"
          @click="emit('edit', product)"
          class="flex-1 rounded-lg bg-indigo-600/20 px-3 py-2 text-sm font-medium text-indigo-400 transition hover:bg-indigo-600 hover:text-white"
        >
          &#9999;&#65039; Edit
        </button>
        <button
          :id="`delete-product-${product.id}`"
          @click="emit('delete', product.id)"
          class="flex-1 rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
        >
          &#128465;&#65039; Delete
        </button>
      </div>
    </div>
  </div>
</template>
