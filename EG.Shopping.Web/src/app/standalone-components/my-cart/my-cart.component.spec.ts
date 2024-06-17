import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCartComponent } from './my-cart.component';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('MyCartComponent', () => {
  let component: MyCartComponent;
  let fixture: ComponentFixture<MyCartComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [MyCartComponent, RouterModule.forRoot([])],
      providers: [{
        provide: CartService,
        useValue: {
          cart$: jasmine.createSpy('cart$'),
          addQuantity: jasmine.createSpy('addQuantity'),
          reduceQuantity: jasmine.createSpy('reduceQuantity'),
          addToCart: jasmine.createSpy('addToCart'),
        }
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: null // You can pass any parameters here if needed
          }

        }
      }],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyCartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    cartService.cart$ = of({
      items: [{
        sku: '123',
        quantity: 2,
        tax: 0,
        discount: 0,
        name: '',
        price: 0,
        unit: '',
        displayPrice: '',
        image: ''
      }], coupon: { percentage: 0, isValid: false, code: '', id: '', maxValue: 0 }
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to cart$ and counter', () => {
    expect(component.counter()).toBe(2);
  });

  it('should unsubscribe from observables on component destroy', () => {
    spyOn(component.componentDestroyed$, 'next');
    spyOn(component.componentDestroyed$, 'complete');

    component.ngOnDestroy();

    expect(component.componentDestroyed$.next).toHaveBeenCalledWith(true);
    expect(component.componentDestroyed$.complete).toHaveBeenCalled();
  });
});
