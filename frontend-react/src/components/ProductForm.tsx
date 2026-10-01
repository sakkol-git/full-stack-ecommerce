// ─── REACT DUMB COMPONENT: ProductForm ────────────────────────────────────────
// Pattern: Presentational / Dumb Component — no API calls, no state management.
// Receives data via PROPS; communicates upward via CALLBACK PROPS.
//
// Vue Equivalent:    defineProps() + defineEmits()
// Angular Equivalent: @Input() + @Output() EventEmitter

import { useState, useEffect } from 'react';
import type { Product, CreateProductPayload } from '../types/product';

// ─── Props Interface ──────────────────────────────────────────────────────────
// Vue equivalent:    const props = defineProps<{ editingProduct: Product | null }>()
// Angular equivalent: @Input() editingProduct: Product | null = null;
interface ProductFormProps {
  editingProduct: Product | null;   // null = create mode, Product = edit mode
  onSave: (payload: CreateProductPayload) => void;   // Vue: defineEmits(['save']); Angular: @Output() save = new EventEmitter()
  onCancel: () => void;                              // Vue: defineEmits(['cancel']); Angular: @Output() cancel = new EventEmitter()
}

// Initial/empty form state — matches CreateProductPayload fields exactly
const emptyForm: CreateProductPayload = {
  name: '',
  description: '',
  price: 0,
  image: '',
};

export default function ProductForm({ editingProduct, onSave, onCancel }: ProductFormProps) {
  // ─── Local form state ──────────────────────────────────────────────────────
  // Vue equivalent:    const form = ref({ name: '', ... })
  // Angular equivalent: this.form = this.fb.group({ name: ['', Validators.required], ... })
  const [form, setForm] = useState<CreateProductPayload>(emptyForm);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  // ─── Sync form with editingProduct when it changes ─────────────────────────
  // Vue equivalent:    watch(() => props.editingProduct, (newVal) => { form.value = {...newVal} })
  // Angular equivalent: ngOnChanges(changes: SimpleChanges) { if (changes['editingProduct']) {...} }
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image: editingProduct.image,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingProduct]);

  // ─── Client-side validation ────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: { name?: string; price?: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.price <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ─── Handle submit ─────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);   // emit upward to the smart/container component (ProductDashboard)
  }

  // ─── Input change handler ──────────────────────────────────────────────────
  function handleChange(field: keyof CreateProductPayload, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'price' ? parseFloat(value) || 0 : value,
    }));
  }

  const isEditing = editingProduct !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-gray-800 p-8 shadow-2xl ring-1 ring-white/10">
        {/* Modal Header */}
        <h2 className="mb-6 text-2xl font-bold text-white">
          {isEditing ? '✏️ Edit Product' : '➕ Add Product'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="product-name" className="mb-1 block text-sm font-medium text-gray-300">
              Product Name *
            </label>
            <input
              id="product-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Mechanical Keyboard"
              className={`w-full rounded-lg border bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-description" className="mb-1 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="product-description"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief product description..."
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="product-price" className="mb-1 block text-sm font-medium text-gray-300">
              Price ($) *
            </label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              value={form.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-lg border bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                errors.price ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="product-image" className="mb-1 block text-sm font-medium text-gray-300">
              Image URL
            </label>
            <input
              id="product-image"
              type="url"
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-600 px-4 py-2.5 font-semibold text-gray-300 transition hover:bg-gray-700 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
