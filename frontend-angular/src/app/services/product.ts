import {Injectable, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export type CreateProductPayload = Omit<Product, "id">;
export type UpdateProductPayload = Partial<CreateProductPayload>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private BASE_URL = 'http://localhost:8080/api/products';
  constructor(private http: HttpClient) { }

  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.BASE_URL);

  }
  createProductPayload(payload: CreateProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.BASE_URL}`, payload )
  }
}
