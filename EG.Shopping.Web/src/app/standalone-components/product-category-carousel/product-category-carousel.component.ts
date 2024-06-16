import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../../services/backend-api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../models/category';

@Component({
  selector: 'app-product-category-carousel',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: './product-category-carousel.component.html',
  styleUrl: './product-category-carousel.component.scss'
})
export class ProductCategoryCarouselComponent implements OnInit {

  categories$?: Observable<Array<Category>>;

  constructor(private backendApi: BackendApiService) { }

  ngOnInit(): void {
    this.categories$ = this.backendApi.getCategories()
  }
}
