import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartDetailsComponent } from "./cart-details.component";
import { Product } from "../../../models/product";
import { CartService } from "../../../services/cart.service";
import { BackendApiService } from "../../../services/backend-api.service";
import { Observable, delay, of, takeUntil } from "rxjs";
import { Cart } from "../../../models/cart";

describe('CartDetailsComponent', () => {
  let component: CartDetailsComponent;
  let fixture: ComponentFixture<CartDetailsComponent>;

  let cartService: CartService;
  let backendApiService: BackendApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDetailsComponent],
      providers: [
        {
          provide: CartService,
          useValue: {
            cart$: jasmine.createSpy('cart$'),
            addQuantity: jasmine.createSpy('addQuantity'),
            reduceQuantity: jasmine.createSpy('reduceQuantity'),
            removeProduct: jasmine.createSpy('removeProduct'),
            applyCoupon: jasmine.createSpy('applyCoupon'),
            calculateTotalPrice: jasmine.createSpy('calculateTotalPrice').and.callFake((cart: Cart) => cart)
          },
        },
        {
          provide: BackendApiService,
          useValue: {
            verifyCoupon: jasmine.createSpy('verifyCoupon')
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CartDetailsComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    cartService.cart$ = of({ items: [], coupon: { percentage: 0, isValid: false, code: '', id: '', maxValue: 0 } });
    backendApiService = TestBed.inject(BackendApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to cart$ and update cart', () => {
    expect(cartService.calculateTotalPrice).toHaveBeenCalled();
    expect(component.cart).not.toBeUndefined();
  });

  it('should add quantity to cart item', () => {
    const cartItem: Product = { name: 'Product 1', tax: 0, discount: 0, sku: '', price: 0, unit: '', displayPrice: '', image: '' };
    component.addQuantity(cartItem);
    expect(cartService.addQuantity).toHaveBeenCalled();
  });

  it('should reduce quantity from cart item', () => {
    const cartItem: Product = { name: 'Product 1', tax: 0, discount: 0, sku: '', price: 0, unit: '', displayPrice: '', image: '' };
    component.reduceQuantity(cartItem);
    expect(cartService.reduceQuantity).toHaveBeenCalled();
  });

  it('should remove product from cart', () => {
    const cartItem: Product = { name: 'Product 1', tax: 0, discount: 0, sku: '', price: 0, unit: '', displayPrice: '', image: '' };
    component.removeProduct(cartItem);
    expect(cartService.removeProduct).toHaveBeenCalled();
  });

  it('should apply coupon to cart when coupon is valid', () => {
    const couponResponse = { isValid: true, percentage: 10, code: 'TEST', id: '123', maxValue: 100 };
    (backendApiService.verifyCoupon as jasmine.Spy).and.returnValue(of(couponResponse)),
      component.applyCoupon();
    expect(cartService.applyCoupon).toHaveBeenCalledOnceWith(couponResponse);
  });

  it('should reset coupon to cart when coupon is invalid', () => {
    const couponResponse = { isValid: false, percentage: 10, code: 'TEST', id: '123', maxValue: 100 };
    (backendApiService.verifyCoupon as jasmine.Spy).and.returnValue(of(couponResponse));
    component.applyCoupon();
    expect(cartService.applyCoupon).toHaveBeenCalledOnceWith({ percentage: 0, isValid: false, code: '', id: '', maxValue: 0 });
  });

  it('should unsubscribe from observables on component destroy', () => {
    spyOn(component.componentDestroyed$, 'next');
    spyOn(component.componentDestroyed$, 'complete');

    component.ngOnDestroy();

    expect(component.componentDestroyed$.next).toHaveBeenCalledWith(true);
    expect(component.componentDestroyed$.complete).toHaveBeenCalled();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });
});
