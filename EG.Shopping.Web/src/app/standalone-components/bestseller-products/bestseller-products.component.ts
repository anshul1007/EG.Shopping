import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendApiService } from '../../services/backend-api.service';
import { CommonModule } from '@angular/common';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-bestseller-products',
  standalone: true,
  imports: [CommonModule, AddToCartComponent],
  templateUrl: './bestseller-products.component.html',
  styleUrl: './bestseller-products.component.scss'
})
export class BestsellerProductsComponent implements OnInit {

  bestseller$?: Observable<Array<Product>>;

  constructor(private backendApi: BackendApiService) { }

  ngOnInit(): void {
    this.bestseller$ = this.backendApi.getBestseller()
  }
}