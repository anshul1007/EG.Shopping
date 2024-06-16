import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { MyCart } from '../constants';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CouponCode } from '../models/discount';
import { BackendApiService } from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSub = new BehaviorSubject<Cart>({} as Cart);
  public cart$: Observable<any>;

  constructor(private localStorageService: LocalStorageService,
    private backendApiService: BackendApiService) {
    this.cart$ = this.cartSub.asObservable();
    const cart = this.getFromLocalStorage();
    this.cartSub.next(cart);
  }

  addToCart(product: Product): void {
    const cart = this.getFromLocalStorage();
    if (!cart.cartId || !cart.items) {
      cart.cartId = this.uuidv4();
      cart.items = [];
      this.setToLocalStorage(cart);
    }

    if (product != null) {
      // check if cart already has same sku product then increase quantity
      const item = cart.items.find(i => i.sku === product.sku);
      if (item) {
        item.quantity = item.quantity + 1;
        this.setToLocalStorage(cart);
        return;
      } else {
        cart.items = [...cart.items, {
          sku: product.sku,
          quantity: 1,
          price: product.price,
          discount: product.discount,
          tax: product.tax,
          name: product.name,
          unit: product.unit,
          displayPrice: product.displayPrice,
          image: product.image,
        }];
        this.setToLocalStorage(cart);
        return;
      }
    }
  }

  addQuantity(product: Product) {
    // add quantity of the product in the cart
    const cart = this.getFromLocalStorage();
    const item = cart.items.find(i => i.sku === product.sku);
    if (item) {
      item.quantity = item.quantity + 1;
      this.setToLocalStorage(cart);
    }
  }

  reduceQuantity(product: Product) {
    const cart = this.getFromLocalStorage();
    const item = cart.items.find(i => i.sku === product.sku);
    if (item) {
      item.quantity = item.quantity - 1;
      if (item.quantity === 0) {
        cart.items = cart.items.filter(i => i.sku !== product.sku);
      }
      this.setToLocalStorage(cart);
    }
  }

  removeProduct(product: Product) {
    const cart = this.getFromLocalStorage();
    cart.items = cart.items.filter(i => i.sku !== product.sku);
    this.setToLocalStorage(cart);
  }

  calculateTotalPrice(cart: Cart): Cart {
    let cartTotal = 0;
    cart.items = cart.items.map(item => {
      // please get the total by applying the discount to the price and adding the tax
      item.total = ((item.price - (item.price * (item.discount || 0) / 100)) + (item.price * (item.tax || 0) / 100)) * item.quantity;
      cartTotal += item.total;
      return item;
    });
    cart.total = cartTotal;
    cart.discountTotal = (cart.total * (cart.discount || 0) / 100);
    // apply discount
    if (cart.total > 750) {
      cart.shippingCharge = 0;
    } else {
      cart.shippingCharge = 50;
    }
    cart.grandTotal = cart.total - cart.discountTotal + cart.shippingCharge;
    return cart;
  }

  applyCoupon(couponCode: CouponCode) {
    const cart = this.getFromLocalStorage();
    cart.discount = couponCode.percentage;
    cart.discountCoupon = couponCode.code;
    this.setToLocalStorage(cart);
  }

  placeOrder(value: any) {
    const cart = this.getFromLocalStorage();
    return this.backendApiService.placeOrder({ checkout: { address: value, cart: cart, payment: 'COD' } });
  }

  private getFromLocalStorage(): Cart {
    return JSON.parse(this.localStorageService.getItem(MyCart) || "{}") as Cart;
  }

  private setToLocalStorage(cart: Cart): void {
    if (cart) {
      this.localStorageService.setItem(MyCart, JSON.stringify(cart));
      this.cartSub.next(cart);
    }
  }

  private uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

}
