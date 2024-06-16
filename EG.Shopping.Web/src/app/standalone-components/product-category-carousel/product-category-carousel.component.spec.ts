import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryCarouselComponent } from './product-category-carousel.component';

describe('ProductCategoryCarouselComponent', () => {
  let component: ProductCategoryCarouselComponent;
  let fixture: ComponentFixture<ProductCategoryCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
