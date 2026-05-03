import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { FrequentPurchasedProduct, PopularProduct, ProfitableProduct, RecentPurchasedItem } from '../models/stats';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly BASE = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.BASE}/products/all`);
    }

    getProductById(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.BASE}/products/${productId}`);
    }

    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(`${this.BASE}/products`, product);
    }

    updateProduct(productId: number, product: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${this.BASE}/products/${productId}`, product);
    }

    getMostFrequentlyPurchasedProducts(limit: number): Observable<FrequentPurchasedProduct[]> {
        return this.http.get<FrequentPurchasedProduct[]>(
            `${this.BASE}/products/frequent/${limit}`
        );
    }

    getMostRecentlyPurchasedProducts(limit: number): Observable<RecentPurchasedItem[]> {
        return this.http.get<RecentPurchasedItem[]>(
            `${this.BASE}/products/recent/${limit}`
        );
    }

    placeOrder(items: { productId: number; quantity: number }[]): Observable<Order> {
        return this.http.post<Order>(`${this.BASE}/orders`, {
            order: items
        });
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.BASE}/orders/all`);
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.BASE}/orders/${orderId}`);
    }

    cancelOrder(orderId: number): Observable<Order> {
        return this.http.patch<Order>(`${this.BASE}/orders/${orderId}/cancel`, {});
    }

    completeOrder(orderId: number): Observable<Order> {
        return this.http.patch<Order>(`${this.BASE}/orders/${orderId}/complete`, {});
    }

    getWatchlist(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.BASE}/watchlist/products/all`);
    }

    addToWatchlist(productId: number): Observable<void> {
        return this.http.post<void>(`${this.BASE}/watchlist/product/${productId}`, {});
    }

    removeFromWatchlist(productId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE}/watchlist/product/${productId}`);
    }

    getMostPopularProducts(limit: number): Observable<PopularProduct[]> {
        return this.http.get<PopularProduct[]>(
            `${this.BASE}/products/popular/${limit}`
        );
    }

    getMostProfitableProducts(limit: number): Observable<ProfitableProduct[]> {
        return this.http.get<ProfitableProduct[]>(
            `${this.BASE}/products/profit/${limit}`
        );
    }
}