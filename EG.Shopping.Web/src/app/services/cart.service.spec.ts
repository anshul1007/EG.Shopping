import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product';
import { BackendApiService } from '../services/backend-api.service';
import { LocalStorageService } from './local-storage.service';

describe('CartService', () => {
  let service: CartService;
  const localStorageMock = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
  localStorageMock.getItem.and.returnValue(null);
  localStorageMock.setItem.and.returnValue(null);


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BackendApiService,
          useValue: {
            // mock the methods of BackendApiService here
          },
        },
        {
          provide: LocalStorageService,
          useValue: localStorageMock,
        },
      ],
    });
    service = TestBed.inject(CartService);
  });

  beforeEach(() => {
    // mock the localstorahge service methods here
    localStorageMock.setItem.and.callFake((key: string, value: string) => {
      localStorageMock.getItem.and.returnValue(value);
    });

    localStorageMock.getItem.and.callFake((key: string) => {
      return localStorageMock[key];
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    // Arrange
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    // Act
    service.addToCart(product);

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.items.length).toBe(1);
      expect(cart.items[0]).toEqual({
        discount: 0,
        displayPrice: '$10',
        image: 'test-image.jpg',
        name: 'Test Product',
        price: 10,
        quantity: 1,
        sku: 'ABC123',
        tax: 0,
        unit: 'pcs'
      });
    });
  });

  it('should add quantity of the product in the cart', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);
    service.addQuantity(product);

    service.cart$.subscribe((cart) => {
      const item = cart.items.find((i: { sku: string }) => i.sku === product.sku);
      expect(item.quantity).toBe(2);
    });
  });

  it('should reduce quantity of the product in the cart', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);
    service.addQuantity(product);
    service.reduceQuantity(product);

    service.cart$.subscribe((cart) => {
      const item = cart.items.find((i: { sku: string }) => i.sku === product.sku);
      expect(item.quantity).toBe(1);
    });
  });

  it('should remove product from the cart', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };


    service.addToCart(product);
    service.removeProduct(product);

    service.cart$.subscribe((cart) => {
      expect(cart.items.length).toBe(0);
    });
  });

  it('should calculate total price of the cart', () => {
    const product1: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product 1',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    const product2: Product = {
      sku: 'ABC124',
      price: 20,
      discount: 0,
      tax: 0,
      name: 'Test Product 2',
      unit: 'pcs',
      displayPrice: '$20',
      image: 'test-image.jpg',
    };

    service.addToCart(product1);
    service.addToCart(product2);

    service.cart$.subscribe((cart) => {
      service.calculateTotalPrice(cart);
      expect(cart.total).toBe(30);
    });
  });

  it('should apply coupon to the cart', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);
    service.applyCoupon({ percentage: 10, isValid: true, code: 'TEST10', id: '123', maxValue: 100 });

    service.cart$.subscribe((cart) => {
      service.calculateTotalPrice(cart);
      expect(cart.discountCoupon).toBe('TEST10');
      expect(cart.discount).toBe(10);
    });
  });

  it('should not apply invalid coupon to the cart', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);
    service.applyCoupon({ percentage: 10, isValid: false, code: 'TEST10', id: '', maxValue: 0 });

    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon).toBe(undefined);
      expect(cart.discount).toBe(undefined);
    });
  });

  it('should apply shipping charge if cart total is less than cut off', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);

    service.cart$.subscribe((cart) => {
      service.calculateTotalPrice(cart);
      expect(cart.shippingCharge).toBe(50);
    });
  });

  it('should apply 0 shipping charge if cart total is more than cut off', () => {
    const product: Product = {
      sku: 'ABC123',
      price: 10,
      discount: 0,
      tax: 0,
      name: 'Test Product',
      unit: 'pcs',
      displayPrice: '$10',
      image: 'test-image.jpg',
    };

    service.addToCart(product);
    service.applyCoupon({ percentage: 10, isValid: false, code: 'TEST10', id: '123', maxValue: 100 });

    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon.percentage).toBe(0);
    });
  });
});