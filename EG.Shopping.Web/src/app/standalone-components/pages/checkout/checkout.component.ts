import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../../models/cart';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  cart = signal<Cart>({} as Cart);

  constructor(private cartService: CartService) {
    this.myForm = new FormGroup({
      // Define your form controls here
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      fullAddress: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      orderNotes: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((cart: Cart) => {
        this.cart.set(this.cartService.calculateTotalPrice(cart));
      });
  }

  placeOrder() {
    if (this.myForm.valid) {
      this.cartService.placeOrder(this.myForm.value)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((response) => {
          if (response.success) {
            alert('Order placed successfully');
          } else {
            alert('Order failed');
          }
        });
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
