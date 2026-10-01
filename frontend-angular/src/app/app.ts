import { Component } from '@angular/core';
import { ProductDashboardComponent } from './components/product-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductDashboardComponent],
  template: '<app-product-dashboard />',
})
export class App {}
