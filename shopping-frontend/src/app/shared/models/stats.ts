export interface ProductProfit {
    productId: number;
    productName: string;
    totalProfit: number;
}

export interface PurchasedProduct {
    productId: number;
    productName: string;
    description: string;
    quantity: number;
    purchasedPrice: number;
}

export interface PopularProduct {
    productId: number;
    productName: string;
    totalSold: number;
}