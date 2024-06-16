import { Component, OnDestroy, OnInit, input, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../models/cart';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.scss'
})
export class AddToCartComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject()
  product = input.required<Product>();
  quantity = signal(0);

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cart: Cart) => {
        // update the counter with the items quantity in the cart
        // get the quantity of the product in the cart
        const productInCart = cart.items.find(item => item.sku === this.product().sku);
        this.quantity.set(productInCart ? productInCart.quantity : 0);
      });
  }

  addToCart() {
    this.cartService.addToCart(this.product());
  }

  addQuantity() {
    this.cartService.addQuantity(this.product());
  }

  reduceQuantity() {
    this.cartService.reduceQuantity(this.product());
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
