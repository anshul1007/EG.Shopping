import { Product } from "./product";

export interface CartItem extends Product {
    total?: number;
    quantity: number;
}
