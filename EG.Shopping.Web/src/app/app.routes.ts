import { Routes } from '@angular/router';
import { HomeComponent } from './standalone-components/pages/home/home.component';
import { CartDetailsComponent } from './standalone-components/pages/cart-details/cart-details.component';
import { CheckoutComponent } from './standalone-components/pages/checkout/checkout.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'cart-details',
        component: CartDetailsComponent,
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
