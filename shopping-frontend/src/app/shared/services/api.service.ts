import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminProduct, CreateProductRequest, Product, UpdateProductRequest } from '../models/product';
import { PopularProduct, ProductProfit, PurchasedProduct } from '../models/stats';
import { OrderItemRequest } from '../models/cart';
import { AdminOrder, Order } from '../models/order';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly BASE = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.BASE}/products/all`);
    }

    getProductById(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.BASE}/products/${productId}`);
    }

    getAdminProducts(): Observable<AdminProduct[]> {
        return this.http.get<AdminProduct[]>(`${this.BASE}/products/all`);
    }

    getAdminProductById(productId: number): Observable<AdminProduct> {
        return this.http.get<AdminProduct>(`${this.BASE}/products/${productId}`);
    }

    createProduct(request: CreateProductRequest): Observable<AdminProduct> {
        return this.http.post<AdminProduct>(`${this.BASE}/products`, request);
    }

    updateProduct(productId: number, request: UpdateProductRequest): Observable<AdminProduct> {
        return this.http.patch<AdminProduct>(`${this.BASE}/products/${productId}`, request);
    }

    getMostFrequentlyPurchasedProducts(limit: number): Observable<PurchasedProduct[]> {
        return this.http.get<PurchasedProduct[]>(`${this.BASE}/products/frequent/${limit}`);
    }

    getMostRecentlyPurchasedProducts(limit: number): Observable<PurchasedProduct[]> {
        return this.http.get<PurchasedProduct[]>(`${this.BASE}/products/recent/${limit}`);
    }

    placeOrder(items: OrderItemRequest[]): Observable<Order> {
        return this.http.post<Order>(`${this.BASE}/orders`, { order: items });
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.BASE}/orders/all`);
    }

    getAdminOrders(): Observable<AdminOrder[]> {
        return this.http.get<AdminOrder[]>(`${this.BASE}/orders/all`);
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.BASE}/orders/${orderId}`);
    }

    cancelOrder(orderId: number): Observable<Order> {
        return this.http.patch<Order>(`${this.BASE}/orders/${orderId}/cancel`, {});
    }

    completeOrder(orderId: number): Observable<AdminOrder> {
        return this.http.patch<AdminOrder>(`${this.BASE}/orders/${orderId}/complete`, {});
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
        return this.http.get<PopularProduct[]>(`${this.BASE}/products/popular/${limit}`);
    }

    getMostProfitableProducts(limit: number): Observable<ProductProfit[]> {
        return this.http.get<ProductProfit[]>(`${this.BASE}/products/profit/${limit}`);
    }
}
