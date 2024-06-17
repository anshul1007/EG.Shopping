
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToCartComponent } from './add-to-cart.component';
import { CartService } from '../../services/cart.service';
import { Subject, of } from 'rxjs';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { Input, input, signal } from '@angular/core';

describe('AddToCartComponent', () => {
  let component: AddToCartComponent;
  let fixture: ComponentFixture<AddToCartComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCartComponent],
      providers: [{
        provide: CartService,
        useValue: {
          cart$: jasmine.createSpy('cart$'),
          addQuantity: jasmine.createSpy('addQuantity'),
          reduceQuantity: jasmine.createSpy('reduceQuantity'),
          addToCart: jasmine.createSpy('addToCart'),
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCartComponent);
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

    const product = signal({sku: '123'})
    component.product = product as unknown as typeof fixture.componentInstance.product;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to cart$ and quantity', () => {
    expect(component.quantity()).toBe(2);
  });

  it('should add quantity to cart item', () => {
    component.addQuantity();
    expect(cartService.addQuantity).toHaveBeenCalledWith({sku: '123'} as unknown as Product);
  });

  it('should reduce quantity from cart item', () => {
    component.reduceQuantity();
    expect(cartService.reduceQuantity).toHaveBeenCalledWith({sku: '123'} as unknown as Product);
  });

  it('should add to cart', () => {
    component.addToCart();
    expect(cartService.addToCart).toHaveBeenCalledWith({sku: '123'} as unknown as Product);
  });

  it('should unsubscribe from observables on component destroy', () => {
    spyOn(component.componentDestroyed$, 'next');
    spyOn(component.componentDestroyed$, 'complete');

    component.ngOnDestroy();

    expect(component.componentDestroyed$.next).toHaveBeenCalledWith(true);
    expect(component.componentDestroyed$.complete).toHaveBeenCalled();
  });
});