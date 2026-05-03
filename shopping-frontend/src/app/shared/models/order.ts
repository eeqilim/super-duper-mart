import { OrderItem } from "./order-item";
import { User } from "./user";

export interface Order {
    id: number;
    userId: number;
    user?: User;
    orderItems: OrderItem[];
    orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED';
    datePlaced: string;
    totalAmount?: number;
}