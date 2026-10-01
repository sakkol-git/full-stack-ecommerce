// ─── ANGULAR SMART COMPONENT: ProductDashboardComponent ───────────────────────
// Pattern: Container / Smart Component — owns all state, calls the service, passes data down.
//
// React Equivalent:  ProductDashboard.tsx using useState + useEffect
// Vue Equivalent:    ProductDashboard.vue using ref() + onMounted()

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product, CreateProductPayload } from '../types/product';
import { ProductService } from '../services/product.service';
import { ProductListComponent } from './product-list.component';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFormComponent],
  templateUrl: './product-dashboard.component.html',
})
export class ProductDashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);

  // ─── State (class properties) ──────────────────────────────────────────────
  // In Angular, class properties are the equivalent of useState.
  // React equivalent:    const [products, setProducts] = useState<Product[]>([])
  // Vue equivalent:      const products = ref<Product[]>([])
  products: Product[] = [];

  // React equivalent:    const [isLoading, setIsLoading] = useState(false)
  // Vue equivalent:      const isLoading = ref(false)
  isLoading = false;

  // React equivalent:    const [showForm, setShowForm] = useState(false)
  // Vue equivalent:      const showForm = ref(false)
  showForm = false;

  // React equivalent:    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  // Vue equivalent:      const editingProduct = ref<Product | null>(null)
  editingProduct: Product | null = null;

  error: string | null = null;

  // ─── Lifecycle Hook: ngOnInit ──────────────────────────────────────────────
  // ngOnInit: Called ONCE after the component is initialized (properties bound).
  // React equivalent:    useEffect(() => { fetchProducts() }, [])
  // Vue equivalent:      onMounted(() => { fetchProducts() })
  ngOnInit(): void {
    this.fetchProducts();
  }

  // ─── Data Fetching ─────────────────────────────────────────────────────────
  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.products = await this.productService.getAll();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load products';
    } finally {
      this.isLoading = false;
    }
  }

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────

  handleAddClick(): void {
    this.editingProduct = null;
    this.showForm = true;   // React: setShowForm(true); Vue: showForm.value = true
  }

  handleEdit(product: Product): void {
    this.editingProduct = product;
    this.showForm = true;
  }

  /** Called when ProductFormComponent emits the 'save' event */
  async handleSave(payload: CreateProductPayload): Promise<void> {
    this.error = null;
    try {
      if (this.editingProduct) {
        const updated = await this.productService.update(this.editingProduct.id, payload);
        this.products = this.products.map((p) => (p.id === updated.id ? updated : p));
      } else {
        const created = await this.productService.create(payload);
        this.products = [created, ...this.products];   // prepend
      }
      this.showForm = false;
      this.editingProduct = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to save product';
    }
  }

  /** Called when ProductFormComponent emits the 'cancel' event */
  handleCancel(): void {
    this.showForm = false;   // React: setShowForm(false); Vue: showForm.value = false
    this.editingProduct = null;
    this.error = null;
  }

  /** Called when ProductListComponent emits the 'delete' event */
  async handleDelete(id: number): Promise<void> {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    this.error = null;
    try {
      await this.productService.delete(id);
      this.products = this.products.filter((p) => p.id !== id);   // optimistic removal
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to delete product';
    }
  }

  dismissError(): void {
    this.error = null;
  }
}
