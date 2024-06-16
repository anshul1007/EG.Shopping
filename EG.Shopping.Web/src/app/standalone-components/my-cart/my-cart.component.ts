import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})
export class MyCartComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject()
  counter = signal(0);

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cart: Cart) => {
        // update the counter with the items quantity in the cart
        this.counter.set(cart.items.reduce((acc, item) => acc + item.quantity, 0));
      });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
