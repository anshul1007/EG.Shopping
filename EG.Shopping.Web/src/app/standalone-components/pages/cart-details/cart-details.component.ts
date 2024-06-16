import { Component, OnDestroy, OnInit, model, signal } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../../models/cart';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { BackendApiService } from '../../../services/backend-api.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit, OnDestroy {

  componentDestroyed$: Subject<boolean> = new Subject();
  cart = signal<Cart>({} as Cart);
  coupon = model<string>('');

  constructor(private cartService: CartService, private backendApiService: BackendApiService) { }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cart: Cart) => {
        this.cart.set(this.cartService.calculateTotalPrice(cart));
      });
  }

  addQuantity(cartItem: Product) {
    this.cartService.addQuantity(cartItem);
  }

  reduceQuantity(cartItem: Product) {
    this.cartService.reduceQuantity(cartItem);
  }

  removeProduct(cartItem: Product) {
    this.cartService.removeProduct(cartItem);
  }

  applyCoupon() {
    this.backendApiService.verifyCoupon(this.coupon())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((response) => {
        if (response.isValid) {
          this.cartService.applyCoupon(response);
        } else {
          this.cartService.applyCoupon({ percentage: 0, isValid: false, code: '', id: '', maxValue: 0});
        }
      });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
