import { Component, EventEmitter, Output } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateProductPayload, Product} from '../../services/product';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
  @Output() save: EventEmitter<CreateProductPayload> = new EventEmitter<CreateProductPayload>();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  })
  handleSubmit() {
    if (this.productForm.invalid) {
        const paylaod = this.productForm.invalid;
    }
  }
  handleCancel() {
    this.productForm.reset();
  }
}
