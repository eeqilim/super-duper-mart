import { Product } from "./product";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderItemRequest {
    productId: number;
    quantity: number;
}

export interface PlaceOrderRequest {
    order: OrderItemRequest[];
}