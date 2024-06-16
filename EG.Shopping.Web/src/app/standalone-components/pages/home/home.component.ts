import { Component } from '@angular/core';
import { ProductCategoryCarouselComponent } from '../../product-category-carousel/product-category-carousel.component';
import { BestsellerProductsComponent } from '../../bestseller-products/bestseller-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCategoryCarouselComponent, BestsellerProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
