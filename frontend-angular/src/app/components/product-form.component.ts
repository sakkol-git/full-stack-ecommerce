// ─── ANGULAR DUMB COMPONENT: ProductFormComponent ────────────────────────────
// Pattern: Presentational / Dumb Component
// Receives data via @Input(); communicates upward via @Output() EventEmitter.
//
// React Equivalent:  Props + callback functions (onSave, onCancel)
// Vue Equivalent:    defineProps() + defineEmits()

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import type { Product, CreateProductPayload } from '../types/product';

@Component({
  selector: 'app-product-form',
  standalone: true,                     // Angular 17+ standalone — no NgModule needed
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  // ─── @Input: receive data from the parent (smart component) ───────────────
  // React equivalent:    editingProduct prop
  // Vue equivalent:      const props = defineProps<{ editingProduct: Product | null }>()
  @Input() editingProduct: Product | null = null;

  // ─── @Output: emit events up to the parent (smart component) ─────────────
  // React equivalent:    onSave: (payload: CreateProductPayload) => void  (callback prop)
  // Vue equivalent:      const emit = defineEmits<{ save: [payload: CreateProductPayload] }>()
  @Output() save = new EventEmitter<CreateProductPayload>();

  // React equivalent:    onCancel: () => void
  // Vue equivalent:      defineEmits<{ cancel: [] }>()
  @Output() cancel = new EventEmitter<void>();

  // ─── Reactive Form ─────────────────────────────────────────────────────────
  // ReactiveFormsModule is Angular's built-in form management.
  // React equivalent:    const [form, setForm] = useState({ name: '', ... })
  // Vue equivalent:      const form = ref({ name: '', ... })
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(2000)]],
    price: [null, [Validators.required, Validators.min(0.01)]],
    image: ['', [Validators.maxLength(1024)]],
  });

  // ─── ngOnChanges: Runs when @Input() properties change ────────────────────
  // React equivalent:    useEffect(() => { if (editingProduct) setForm({...}) }, [editingProduct])
  // Vue equivalent:      watch(() => props.editingProduct, (newVal) => { form.value = {...} })
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingProduct']) {
      const p = this.editingProduct;
      if (p) {
        this.form.patchValue({
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
        });
      } else {
        this.form.reset();
      }
    }
  }

  get isEditing(): boolean {
    return this.editingProduct !== null;
  }

  // ─── Form submission ───────────────────────────────────────────────────────
  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // shows all validation errors
      return;
    }
    // emit the save event — React: onSave(payload); Vue: emit('save', payload)
    this.save.emit(this.form.value as CreateProductPayload);
  }

  // ─── Helper: check if a field has an error (for template binding) ─────────
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.touched && control?.hasError(error));
  }
}
