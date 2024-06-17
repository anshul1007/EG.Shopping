import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterModule.forRoot([])],
      providers: [{
        provide: CartService,
        useValue: {
          cart$: jasmine.createSpy('cart$'),
          addQuantity: jasmine.createSpy('addQuantity'),
          reduceQuantity: jasmine.createSpy('reduceQuantity'),
          removeProduct: jasmine.createSpy('removeProduct'),
          applyCoupon: jasmine.createSpy('applyCoupon'),
          calculateTotalPrice: jasmine.createSpy('calculateTotalPrice').and.callFake((cart: Cart) => cart)
        },
      }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    cartService.cart$ = of({ items: [], coupon: { percentage: 0, isValid: false, code: '', id: '', maxValue: 0 } });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
