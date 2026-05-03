import { Product } from "./product";

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    purchasedPrice: number;
    wholesalePrice: number;
}