import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../../services/product';

@Component({
  imports: [],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit{
  products: Product[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService) {
  }

    ngOnInit(): void {
        this.productService.getAllProduct().subscribe({
          next: (data) => {
            this.products = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.log("API Error",err);
            this.products = [];
            this.isLoading = false;
            throw new Error("Error getting products list");
          }
          }
        )
    }

}
