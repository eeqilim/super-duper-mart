export type OrderStatus = 'PROCESSING' | 'COMPLETED' | 'CANCELED';

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    purchasedPrice: number;
}

export interface Order {
    orderId: number;
    datePlaced: string;
    orderStatus: OrderStatus;
    order: OrderItem[];
}

export interface AdminOrder {
    orderId: number;
    datePlaced: string;
    orderStatus: OrderStatus;
    userId: number;
    userName: string;
    order: OrderItem[];
}