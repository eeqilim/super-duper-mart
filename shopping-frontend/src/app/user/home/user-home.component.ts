import { Component, OnInit } from '@angular/core';

import { Order } from 'src/app/shared/models/order';
import { Product } from 'src/app/shared/models/product';
import { PurchasedProduct } from 'src/app/shared/models/stats';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
    orders: Order[] = [];
    frequentProducts: PurchasedProduct[] = [];
    recentItems: PurchasedProduct[] = [];

    orderColumns = ['orderId', 'datePlaced', 'orderStatus', 'total', 'actions'];
    frequentColumns = ['productName', 'quantity', 'purchasedPrice'];
    recentColumns = ['productName', 'quantity', 'purchasedPrice', 'subtotal'];

    message = '';
    errorMessage = '';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) return;
        this.loadOrders();
        this.loadStats();
    }

    get processingCount(): number {
        return this.orders.filter(order => order.orderStatus === 'PROCESSING').length;
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

    loadStats(): void {
        this.apiService.getMostFrequentlyPurchasedProducts(3).subscribe({
            next: data => {
                this.frequentProducts = data;
            },
            error: () => {
                this.errorMessage = 'Failed to load frequent products.';
            }
        });

        this.apiService.getMostRecentlyPurchasedProducts(3).subscribe({
            next: data => {
                this.recentItems = data;
            },
            error: () => {
                this.errorMessage = 'Failed to load recent products.';
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

    getOrderTotal(order: Order): number {
        return order.order.reduce((sum, item) => sum + item.purchasedPrice * item.quantity, 0);
    }

    canCancel(order: Order): boolean {
        return order.orderStatus === 'PROCESSING';
    }

    statusClass(status: string): string {
        if (status === 'PROCESSING') return 'status-processing';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}