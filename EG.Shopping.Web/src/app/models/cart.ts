import { CartItem } from "./cart-item";

export interface Cart {
    discountCoupon?: any;
    shippingCharge?: any;
    total?: number;
    discountTotal?: number;
    discount?: number;
    grandTotal?: number;
    cartId: string;
    items: CartItem[];
}