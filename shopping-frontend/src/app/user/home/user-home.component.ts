import { Component, OnInit } from '@angular/core';

import { Order } from 'src/app/shared/models/order';
import { Product } from 'src/app/shared/models/product';
import { FrequentPurchasedProduct, RecentPurchasedItem } from 'src/app/shared/models/stats';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
    orders: Order[] = [];
    watchlist: Product[] = [];
    frequentProducts: FrequentPurchasedProduct[] = [];
    recentItems: RecentPurchasedItem[] = [];

    orderColumns = ['orderId', 'datePlaced', 'orderStatus', 'total', 'actions'];
    watchlistColumns = ['name', 'retailPrice', 'actions'];
    frequentColumns = ['name', 'totalQuantity', 'latestPurchasedPrice'];
    recentColumns = ['name', 'quantity', 'purchasedPrice'];

    message = '';
    errorMessage = '';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) return; // ← add this
        this.loadOrders();
        this.loadWatchlist();
        this.loadStats();
    }

    get pendingCount(): number {
        return this.orders.filter(order => order.orderStatus === 'PENDING').length;
    }

    get completedCount(): number {
        return this.orders.filter(order => order.orderStatus === 'COMPLETED').length;
    }

    loadOrders(): void {
        this.apiService.getOrders().subscribe({
            next: orders => {
                this.orders = orders;
            },
            error: () => {
                this.errorMessage = 'Failed to load orders.';
            }
        });
    }

    loadWatchlist(): void {
        this.apiService.getWatchlist().subscribe({
            next: products => {
                this.watchlist = products;
            },
            error: () => {
                this.errorMessage = 'Failed to load watchlist.';
            }
        });
    }

    loadStats(): void {
        this.apiService.getMostFrequentlyPurchasedProducts(3).subscribe({
            next: data => {
                this.frequentProducts = data;
            }
        });

        this.apiService.getMostRecentlyPurchasedProducts(3).subscribe({
            next: data => {
                this.recentItems = data;
            }
        });
    }

    cancelOrder(orderId: number): void {
        this.apiService.cancelOrder(orderId).subscribe({
            next: () => {
                this.message = 'Order canceled successfully.';
                this.loadOrders();
            },
            error: () => {
                this.errorMessage = 'Failed to cancel order.';
            }
        });
    }

    removeFromWatchlist(productId: number): void {
        this.apiService.removeFromWatchlist(productId).subscribe({
            next: () => {
                this.message = 'Product removed from watchlist.';
                this.loadWatchlist();
            },
            error: () => {
                this.errorMessage = 'Failed to remove product from watchlist.';
            }
        });
    }

    getOrderTotal(order: Order): number {
        return (order as any).totalPrice ?? (order as any).totalAmount ?? 0;
    }

    canCancel(order: Order): boolean {
        return order.orderStatus === 'PENDING';
    }

    statusClass(status: string): string {
        if (status === 'PENDING') return 'status-pending';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}