import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestsellerProductsComponent } from './bestseller-products.component';
import { BackendApiService } from '../../services/backend-api.service';

describe('BestsellerProductsComponent', () => {
  let component: BestsellerProductsComponent;
  let fixture: ComponentFixture<BestsellerProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestsellerProductsComponent],
      providers: [
        {
          provide: BackendApiService,
          useValue: {
            getBestseller: jasmine.createSpy('getBestseller')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestsellerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
