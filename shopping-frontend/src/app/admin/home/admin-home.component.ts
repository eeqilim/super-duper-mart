import { Component, OnInit } from '@angular/core';

import { PopularProduct, ProductProfit } from 'src/app/shared/models/stats';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdminOrder } from 'src/app/shared/models/order';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
    orders: AdminOrder[] = [];
    popularProducts: PopularProduct[] = [];
    profitableProducts: ProductProfit[] = [];

    popularColumns = ['productName', 'totalSold'];
    profitColumns = ['productName', 'totalProfit'];
    orderColumns = ['orderId', 'userName', 'datePlaced', 'orderStatus', 'total', 'actions'];

    message = '';
    errorMessage = '';

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) return;
        this.loadDashboard();
    }

    get processingCount(): number {
        return this.orders.filter(order => order.orderStatus === 'PROCESSING').length;
    }

    get completedCount(): number {
        return this.orders.filter(order => order.orderStatus === 'COMPLETED').length;
    }

    get mostProfitableProduct(): ProductProfit | null {
        return this.profitableProducts.length > 0 ? this.profitableProducts[0] : null;
    }

    get totalSuccessfullySoldItems(): number {
        return this.orders
            .filter(order => order.orderStatus === 'COMPLETED')
            .reduce((sum, order) => sum + order.order.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    }

    loadDashboard(): void {
        this.loadOrders();
        this.loadStats();
    }

    loadOrders(): void {
        this.apiService.getAdminOrders().subscribe({
            next: orders => {
                this.orders = orders;
            },
            error: () => {
                this.errorMessage = 'Failed to load orders.';
            }
        });
    }

    loadStats(): void {
        this.apiService.getMostPopularProducts(3).subscribe({
            next: data => {
                this.popularProducts = data;
            },
            error: () => {
                this.errorMessage = 'Failed to load popular products.';
            }
        });

        this.apiService.getMostProfitableProducts(3).subscribe({
            next: data => {
                this.profitableProducts = data;
            },
            error: () => {
                this.errorMessage = 'Failed to load profitable products.';
            }
        });
    }

    completeOrder(orderId: number): void {
        this.apiService.completeOrder(orderId).subscribe({
            next: () => {
                this.message = 'Order completed successfully.';
                this.loadOrders();
            },
            error: () => {
                this.errorMessage = 'Failed to complete order.';
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

    canUpdate(order: AdminOrder): boolean {
        return order.orderStatus === 'PROCESSING';
    }

    getOrderTotal(order: AdminOrder): number {
        return order.order.reduce((sum, item) => sum + item.purchasedPrice * item.quantity, 0);
    }

    statusClass(status: string): string {
        if (status === 'PROCESSING') return 'status-processing';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}
