export interface RecentPurchasedItem {
    itemId: number;
    productId: number;
    productName: string;
    description: string;
    quantity: number;
    purchasedPrice: number;
}

export interface FrequentPurchasedProduct {
    productId: number;
    productName: string;
    description: string;
    totalQuantity: number;
    latestPurchasedPrice: number;
}

export interface PopularProduct {
    productId: number;
    productName: string;
    totalSold: number;
}

export interface ProfitableProduct {
    productId: number;
    productName: string;
    totalProfit: number;
}

export interface UserStats {
    recentPurchasedItems: RecentPurchasedItem[];
    frequentPurchasedProducts: FrequentPurchasedProduct[];
}

export interface AdminStats {
    popularProducts: PopularProduct[];
    profitableProducts: ProfitableProduct[];
}