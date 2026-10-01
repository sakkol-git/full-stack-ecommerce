// ─── REACT SMART COMPONENT: ProductDashboard ─────────────────────────────────
// Pattern: Container / Smart Component — owns all state, calls API, passes data down.
// Renders dumb components (ProductList, ProductForm) and coordinates them.
//
// Vue Equivalent:    ProductDashboard.vue using <script setup> with ref() + onMounted()
// Angular Equivalent: ProductDashboardComponent using signals / properties + ngOnInit()

import { useState, useEffect, useCallback } from 'react';
import type { Product, CreateProductPayload } from '../types/product';
import { productService } from '../services/product.service';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

export default function ProductDashboard() {
  // ─── State Declaration ──────────────────────────────────────────────────────
  // Vue equivalent:    const products = ref<Product[]>([])
  // Angular equivalent: products: Product[] = [];
  const [products, setProducts] = useState<Product[]>([]);

  // Vue equivalent:    const isLoading = ref(false)
  // Angular equivalent: isLoading = false;
  const [isLoading, setIsLoading] = useState(false);

  // Vue equivalent:    const showForm = ref(false)
  // Angular equivalent: showForm = false;
  const [showForm, setShowForm] = useState(false);

  // Tracks which product is being edited (null = creating a new one)
  // Vue equivalent:    const editingProduct = ref<Product | null>(null)
  // Angular equivalent: editingProduct: Product | null = null;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Stores API error messages for display
  const [error, setError] = useState<string | null>(null);

  // ─── Data Fetching ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Lifecycle Hook: Component Mount ───────────────────────────────────────
  // useEffect with [] = runs ONCE after first render (component mount)
  // Vue equivalent:    onMounted(() => fetchProducts())
  // Angular equivalent: ngOnInit() { this.fetchProducts(); }
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────

  /** Open the form in CREATE mode */
  function handleAddClick() {
    setEditingProduct(null);
    setShowForm(true);    // Vue: showForm.value = true; Angular: this.showForm = true;
  }

  /** Open the form in EDIT mode, pre-filled with the selected product */
  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  /** Called by ProductForm's onSave callback — creates or updates */
  async function handleSave(payload: CreateProductPayload) {
    setError(null);
    try {
      if (editingProduct) {
        // UPDATE path
        const updated = await productService.update(editingProduct.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        // CREATE path
        const created = await productService.create(payload);
        setProducts((prev) => [created, ...prev]);  // prepend so it appears first
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  }

  /** Called by ProductList's onDelete callback */
  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setError(null);
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));   // optimistic removal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  }

  /** Close the form modal without saving */
  function handleCancel() {
    setShowForm(false);   // Vue: showForm.value = false; Angular: this.showForm = false;
    setEditingProduct(null);
    setError(null);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛍️</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Product Catalog</h1>
              <p className="text-xs text-indigo-400">⚛️ React 19 + Spring Boot</p>
            </div>
          </div>
          <button
            id="add-product-btn"
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 active:scale-95"
          >
            <span className="text-lg">+</span> Add Product
          </button>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-900/20 px-5 py-4">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-300">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200">
              ✕
            </button>
          </div>
        )}

        {/* Stats Bar */}
        {!isLoading && (
          <div className="mb-8 flex items-center gap-6">
            <div className="rounded-xl bg-gray-800 px-5 py-3 ring-1 ring-white/5">
              <p className="text-xs text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-indigo-400">{products.length}</p>
            </div>
          </div>
        )}

        {/* Dumb Component: ProductList receives products + callbacks as props */}
        {/* Vue equivalent:    <ProductList :products="products" :is-loading="isLoading" @edit="handleEdit" @delete="handleDelete" /> */}
        {/* Angular equivalent: <app-product-list [products]="products" [isLoading]="isLoading" (edit)="handleEdit($event)" (delete)="handleDelete($event)" /> */}
        <ProductList
          products={products}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Modal Form ────────────────────────────────────────────────────── */}
      {/* Conditionally rendered: Vue uses v-if="showForm"; Angular uses @if (showForm) */}
      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
