import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Component } from '@angular/core';
import { ProductCategoryCarouselComponent } from '../../product-category-carousel/product-category-carousel.component';
import { BestsellerProductsComponent } from '../../bestseller-products/bestseller-products.component';


@Component({
  selector: 'app-product-category-carousel',
  standalone: true,
  template: '',
  providers: [{ provide: ProductCategoryCarouselComponent, useClass: MockProductCategoryCarouselComponent }],
})
export class MockProductCategoryCarouselComponent {
  public exists = true;
}

@Component({
  selector: 'app-bestseller-products',
  standalone: true,
  template: '',
  providers: [{ provide: BestsellerProductsComponent, useClass: MockBestsellerProductsComponent }],
})
export class MockBestsellerProductsComponent {
  public exists = true;
}


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [BestsellerProductsComponent, ProductCategoryCarouselComponent] },
        add: { imports: [MockBestsellerProductsComponent, MockProductCategoryCarouselComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
