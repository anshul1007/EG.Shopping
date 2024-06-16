import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { Product } from '../models/product';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
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
      expect(cart.items[0]).toEqual(product);
    });
  });

  it('should add quantity of the product in the cart', () => {
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
    service.addQuantity(product);

    // Assert
    service.cart$.subscribe((cart) => {
      const item = cart.items.find((i: { sku: string; }) => i.sku === product.sku);
      expect(item.quantity).toBe(2);
    });
  });

  it('should reduce quantity of the product in the cart', () => {
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
    service.addQuantity(product);
    service.reduceQuantity(product);

    // Assert
    service.cart$.subscribe((cart) => {
      const item = cart.items.find((i: { sku: string; }) => i.sku === product.sku);
      expect(item.quantity).toBe(1);
    });

  });


  it('should remove product from the cart', () => {
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
    service.removeProduct(product);

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.items.length).toBe(0);
    });
  });

  it('should calculate total price of the cart', () => {
    // Arrange
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

    // Act
    service.addToCart(product1);
    service.addToCart(product2);

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.total).toBe(30);
    });
  });

  it('should apply coupon to the cart', () => {
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
    service.applyCoupon({ percentage: 10, isValid: true, code: 'TEST10', id: '123', maxValue: 100 });

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon.percentage).toBe(10);
    });
  });


  it('should not apply invalid coupon to the cart', () => {
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
    service.applyCoupon({ percentage: 0, isValid: false, code: '', id: '', maxValue: 0 });

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon.percentage).toBe(0);
    });
  });

  it('should not apply coupon if cart total is less than max value', () => {
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
    service.applyCoupon({ percentage: 10, isValid: true, code: 'TEST10', id: '123', maxValue: 5 });

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon.percentage).toBe(0);
    });
  });

  it('should not apply coupon if it is invalid', () => {
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
    service.applyCoupon({ percentage: 10, isValid: false, code: 'TEST10', id: '123', maxValue: 100 });

    // Assert
    service.cart$.subscribe((cart) => {
      expect(cart.discountCoupon.percentage).toBe(0);
    });
  });


});