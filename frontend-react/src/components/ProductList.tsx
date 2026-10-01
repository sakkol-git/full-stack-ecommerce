// ─── REACT DUMB COMPONENT: ProductList ────────────────────────────────────────
// Pattern: Presentational / Dumb Component — renders a list, emits events.
// NO API calls, NO state — all data flows in via PROPS.
//
// Vue Equivalent:    defineProps() receives products[]; defineEmits() fires edit/delete
// Angular Equivalent: @Input() products: Product[]; @Output() edit/delete EventEmitter

import type { Product } from '../types/product';

// ─── Props Interface ──────────────────────────────────────────────────────────
// Vue equivalent:    defineProps<{ products: Product[], isLoading: boolean }>()
// Angular equivalent: @Input() products: Product[] = []; @Input() isLoading = false;
interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;    // Vue: defineEmits(['edit']); Angular: @Output() edit = new EventEmitter<Product>()
  onDelete: (id: number) => void;        // Vue: defineEmits(['delete']); Angular: @Output() delete = new EventEmitter<number>()
}

export default function ProductList({ products, isLoading, onEdit, onDelete }: ProductListProps) {

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <span className="ml-4 text-lg text-gray-400">Loading catalog...</span>
      </div>
    );
  }

  // ─── Empty State ───────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl">📦</span>
        <h3 className="mt-4 text-xl font-semibold text-gray-300">No products yet</h3>
        <p className="mt-2 text-gray-500">Click "Add Product" to create your first item.</p>
      </div>
    );
  }

  // ─── Product Grid ──────────────────────────────────────────────────────────
  // Vue equivalent:    v-for="product in products" :key="product.id"
  // Angular equivalent: @for (product of products; track product.id) { ... }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}         // React's key prop — Vue uses :key, Angular uses track
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ─── Sub-component: ProductCard ────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-lg ring-1 ring-white/5 transition hover:-translate-y-1 hover:shadow-indigo-500/20 hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-700">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/400x200/1f2937/6366f1?text=No+Image';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">🖼️</div>
        )}
        {/* Price Badge */}
        <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-sm font-bold text-white shadow-lg">
          ${Number(product.price).toFixed(2)}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-400">
          {product.description || 'No description provided.'}
        </p>
        <p className="mt-2 text-xs text-gray-600">
          Added: {new Date(product.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t border-gray-700 p-4">
        <button
          id={`edit-product-${product.id}`}
          onClick={() => onEdit(product)}
          className="flex-1 rounded-lg bg-indigo-600/20 px-3 py-2 text-sm font-medium text-indigo-400 transition hover:bg-indigo-600 hover:text-white"
        >
          ✏️ Edit
        </button>
        <button
          id={`delete-product-${product.id}`}
          onClick={() => onDelete(product.id)}
          className="flex-1 rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
