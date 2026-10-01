<script setup lang="ts">
// ─── VUE SMART COMPONENT: ProductDashboard ────────────────────────────────────
// Pattern: Container / Smart Component — owns state, calls API, passes data down.
//
// React Equivalent:  ProductDashboard.tsx using useState + useEffect
// Angular Equivalent: ProductDashboardComponent using properties/signals + ngOnInit()

import { ref, onMounted } from 'vue'
import type { Product, CreateProductPayload } from '../types/product'
import { productService } from '../services/product.service'
import ProductList from '../components/ProductList.vue'
import ProductForm from '../components/ProductForm.vue'

// ─── State Declaration ──────────────────────────────────────────────────────────
// ref() creates reactive state — Vue tracks changes and re-renders automatically.
// React equivalent:    const [products, setProducts] = useState<Product[]>([])
// Angular equivalent:  products: Product[] = [];
const products = ref<Product[]>([])

// React equivalent:    const [isLoading, setIsLoading] = useState(false)
// Angular equivalent:  isLoading = false;
const isLoading = ref(false)

// React equivalent:    const [showForm, setShowForm] = useState(false)
// Angular equivalent:  showForm = false;
const showForm = ref(false)

// React equivalent:    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
// Angular equivalent:  editingProduct: Product | null = null;
const editingProduct = ref<Product | null>(null)

const error = ref<string | null>(null)

// ─── Data Fetching ─────────────────────────────────────────────────────────────
async function fetchProducts() {
  isLoading.value = true
  error.value = null
  try {
    products.value = await productService.getAll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

// ─── Lifecycle Hook: onMounted ──────────────────────────────────────────────────
// onMounted: Runs ONCE after the component is inserted into the DOM.
// React equivalent:    useEffect(() => { fetchProducts() }, [])
// Angular equivalent:  ngOnInit() { this.fetchProducts(); }
onMounted(() => {
  fetchProducts()
})

// ─── CRUD Handlers ─────────────────────────────────────────────────────────────

function handleAddClick() {
  editingProduct.value = null
  showForm.value = true   // React: setShowForm(true); Angular: this.showForm = true
}

function handleEdit(product: Product) {
  editingProduct.value = product
  showForm.value = true
}

async function handleSave(payload: CreateProductPayload) {
  error.value = null
  try {
    if (editingProduct.value) {
      const updated = await productService.update(editingProduct.value.id, payload)
      const idx = products.value.findIndex((p) => p.id === updated.id)
      if (idx !== -1) products.value[idx] = updated
    } else {
      const created = await productService.create(payload)
      products.value = [created, ...products.value]
    }
    showForm.value = false
    editingProduct.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save product'
  }
}

function handleCancel() {
  showForm.value = false   // React: setShowForm(false); Angular: this.showForm = false
  editingProduct.value = null
  error.value = null
}

async function handleDelete(id: number) {
  if (!window.confirm('Are you sure you want to delete this product?')) return
  error.value = null
  try {
    await productService.delete(id)
    products.value = products.value.filter((p) => p.id !== id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete product'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="sticky top-0 z-40 border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">&#128717;</span>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-white">Product Catalog</h1>
            <p class="text-xs text-indigo-400">&#129312; Vue 3 + Spring Boot</p>
          </div>
        </div>
        <button
          id="add-product-btn"
          @click="handleAddClick"
          class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 active:scale-95"
        >
          <span class="text-lg">+</span> Add Product
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <div
        v-if="error"
        class="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-900/20 px-5 py-4"
      >
        <span class="text-xl">&#9888;&#65039;</span>
        <p class="text-sm text-red-300">{{ error }}</p>
        <button @click="error = null" class="ml-auto text-red-400 hover:text-red-200">&#10005;</button>
      </div>

      <div v-if="!isLoading" class="mb-8 flex items-center gap-6">
        <div class="rounded-xl bg-gray-800 px-5 py-3 ring-1 ring-white/5">
          <p class="text-xs text-gray-400">Total Products</p>
          <p class="text-2xl font-bold text-indigo-400">{{ products.length }}</p>
        </div>
      </div>

      <!--
        Props flow DOWN (:products, :is-loading); events bubble UP (@edit, @delete)
        React equivalent:    <ProductList products={products} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        Angular equivalent:  <app-product-list [products]="products" [isLoading]="isLoading" (edit)="handleEdit($event)" (delete)="handleDelete($event)" />
      -->
      <ProductList
        :products="products"
        :is-loading="isLoading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </main>

    <!--
      v-if controls whether the form is in the DOM.
      React equivalent:    {showForm && <ProductForm ... />}
      Angular equivalent:  @if (showForm) { <app-product-form ... /> }
    -->
    <ProductForm
      v-if="showForm"
      :editing-product="editingProduct"
      @save="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>
