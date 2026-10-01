<script setup lang="ts">
// ─── VUE DUMB COMPONENT: ProductForm ──────────────────────────────────────────
// Pattern: Presentational / Dumb Component
// Receives data via defineProps(); communicates upward via defineEmits().
//
// React Equivalent:  Props + callback functions (onSave, onCancel)
// Angular Equivalent: @Input() + @Output() EventEmitter

import { ref, watch } from 'vue'
import type { Product, CreateProductPayload } from '../types/product'

// ─── Props ─────────────────────────────────────────────────────────────────────
// React equivalent:    interface ProductFormProps { editingProduct: Product | null; onSave: ...; onCancel: ... }
// Angular equivalent:  @Input() editingProduct: Product | null = null;
const props = defineProps<{
  editingProduct: Product | null   // null = create mode, Product = edit mode
}>()

// ─── Emits ─────────────────────────────────────────────────────────────────────
// React equivalent:    onSave: (payload: CreateProductPayload) => void  (passed as prop)
// Angular equivalent:  @Output() save = new EventEmitter<CreateProductPayload>();
//                      @Output() cancel = new EventEmitter<void>();
const emit = defineEmits<{
  save: [payload: CreateProductPayload]   // emits 'save' event with a payload
  cancel: []                              // emits 'cancel' event with no data
}>()

// ─── Local reactive form state ─────────────────────────────────────────────────
// React equivalent:    const [form, setForm] = useState({ name: '', ... })
// Angular equivalent:  this.form = this.fb.group({ name: ['', Validators.required], ... })
const form = ref<CreateProductPayload>({
  name: '',
  description: '',
  price: 0,
  image: '',
})

const errors = ref<Partial<Record<keyof CreateProductPayload, string>>>({})

// ─── Watch: sync form when editingProduct prop changes ─────────────────────────
// React equivalent:    useEffect(() => { if (editingProduct) setForm({...}) }, [editingProduct])
// Angular equivalent:  ngOnChanges(changes: SimpleChanges) { if (changes['editingProduct']) { ... } }
watch(
  () => props.editingProduct,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        description: newVal.description,
        price: newVal.price,
        image: newVal.image,
      }
    } else {
      form.value = { name: '', description: '', price: 0, image: '' }
    }
    errors.value = {}
  },
  { immediate: true }   // run on initial mount too
)

// ─── Client-side validation ────────────────────────────────────────────────────
function validate(): boolean {
  const newErrors: Partial<Record<keyof CreateProductPayload, string>> = {}
  if (!form.value.name.trim()) newErrors.name = 'Name is required'
  if (form.value.price <= 0) newErrors.price = 'Price must be greater than 0'
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// ─── Handle submit ─────────────────────────────────────────────────────────────
function handleSubmit() {
  if (!validate()) return
  emit('save', { ...form.value })   // emit upward — React: onSave(form); Angular: this.save.emit(form)
}

const isEditing = () => props.editingProduct !== null
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="w-full max-w-lg rounded-2xl bg-gray-800 p-8 shadow-2xl ring-1 ring-white/10">
      <h2 class="mb-6 text-2xl font-bold text-white">
        {{ isEditing() ? '\u270F\uFE0F Edit Product' : '\u2795 Add Product' }}
      </h2>

      <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
        <div>
          <label for="product-name" class="mb-1 block text-sm font-medium text-gray-300">
            Product Name *
          </label>
          <input
            id="product-name"
            v-model="form.name"
            type="text"
            placeholder="e.g. Mechanical Keyboard"
            :class="[
              'w-full rounded-lg border bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500',
              errors.name ? 'border-red-500' : 'border-gray-600'
            ]"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name }}</p>
        </div>

        <div>
          <label for="product-description" class="mb-1 block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="product-description"
            v-model="form.description"
            rows="3"
            placeholder="Brief product description..."
            class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="product-price" class="mb-1 block text-sm font-medium text-gray-300">
            Price ($) *
          </label>
          <input
            id="product-price"
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            :class="[
              'w-full rounded-lg border bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500',
              errors.price ? 'border-red-500' : 'border-gray-600'
            ]"
          />
          <p v-if="errors.price" class="mt-1 text-xs text-red-400">{{ errors.price }}</p>
        </div>

        <div>
          <label for="product-image" class="mb-1 block text-sm font-medium text-gray-300">
            Image URL
          </label>
          <input
            id="product-image"
            v-model="form.image"
            type="url"
            placeholder="https://..."
            class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            class="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
          >
            {{ isEditing() ? 'Save Changes' : 'Create Product' }}
          </button>
          <button
            type="button"
            @click="emit('cancel')"
            class="flex-1 rounded-lg border border-gray-600 px-4 py-2.5 font-semibold text-gray-300 transition hover:bg-gray-700 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
