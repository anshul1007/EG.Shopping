
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToCartComponent } from './add-to-cart.component';
import { CartService } from '../../services/cart.service';
import { Subject } from 'rxjs';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { Input, input, signal } from '@angular/core';

describe('AddToCartComponent', () => {
  let component: AddToCartComponent;
  let fixture: ComponentFixture<AddToCartComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToCartComponent],
      providers: [CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToCartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the quantity when the cart changes', () => {
    const cart: Cart = {
      items: [
        {
          sku: '123', quantity: 2,
          tax: 0,
          discount: 0,
          name: '',
          price: 0,
          unit: '',
          displayPrice: '',
          image: ''
        },
        {
          sku: '456', quantity: 3,
          tax: 0,
          discount: 0,
          name: '',
          price: 0,
          unit: '',
          displayPrice: '',
          image: ''
        }
      ],
      cartId: ''
    };
    const product: Product = {
      sku: '123',
      tax: 0,
      discount: 0,
      name: '',
      price: 0,
      unit: '',
      displayPrice: '',
      image: ''
    };

    spyOn(cartService.cart$, 'pipe').and.returnValue(
      new Subject<Cart>().asObservable()
    );

    TestBed.runInInjectionContext(() => {
      component.product = Input('Test user')
    });

    component.ngOnInit();

    expect(component.quantity).toBe(2);
  });

  it('should add product to cart', () => {
    const product: Product = {
      sku: '123',
      tax: 0,
      discount: 0,
      name: '',
      price: 0,
      unit: '',
      displayPrice: '',
      image: ''
    };

    spyOn(cartService, 'addToCart');

    TestBed.runInInjectionContext(() => {
      component.product = Input('Test user')
    });
    component.addToCart();

    expect(cartService.addToCart).toHaveBeenCalledWith(product);
  });

  it('should add quantity to cart', () => {
    const product: Product = {
      sku: '123',
      tax: 0,
      discount: 0,
      name: '',
      price: 0,
      unit: '',
      displayPrice: '',
      image: ''
    };

    spyOn(cartService, 'addQuantity');

    TestBed.runInInjectionContext(() => {
      component.product = Input('Test user')
    });
    component.addQuantity();

    expect(cartService.addQuantity).toHaveBeenCalledWith(product);
  });

  it('should reduce quantity from cart', () => {
    const product: Product = {
      sku: '123',
      tax: 0,
      discount: 0,
      name: '',
      price: 0,
      unit: '',
      displayPrice: '',
      image: ''
    };

    spyOn(cartService, 'reduceQuantity');

    TestBed.runInInjectionContext(() => {
      component.product = Input('Test user')
    });
    component.reduceQuantity();

    expect(cartService.reduceQuantity).toHaveBeenCalledWith(product);
  });

  it('should unsubscribe from observables on component destroy', () => {
    spyOn(component.componentDestroyed$, 'next');
    spyOn(component.componentDestroyed$, 'complete');

    component.ngOnDestroy();

    expect(component.componentDestroyed$.next).toHaveBeenCalledWith(true);
    expect(component.componentDestroyed$.complete).toHaveBeenCalled();
  });
});