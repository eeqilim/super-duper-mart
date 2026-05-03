import { Component, OnInit } from '@angular/core';
import { Order } from '../../shared/models/order';
import { PopularProduct, ProfitableProduct } from 'src/app/shared/models/stats';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
    orders: Order[] = [];
    popularProducts: PopularProduct[] = [];
    profitableProducts: ProfitableProduct[] = [];

    popularColumns = ['name', 'totalSold'];
    profitColumns = ['name', 'totalProfit'];
    orderColumns = ['orderId', 'datePlaced', 'orderStatus', 'total', 'actions'];

    message = '';
    errorMessage = '';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) return;
        this.loadDashboard();
    }

    get pendingCount(): number {
        return this.orders.filter(order => order.orderStatus === 'PENDING').length;
    }

    get completedCount(): number {
        return this.orders.filter(order => order.orderStatus === 'COMPLETED').length;
    }

    get mostProfitableProduct(): ProfitableProduct | null {
        return this.profitableProducts.length > 0 ? this.profitableProducts[0] : null;
    }

    loadDashboard(): void {
        this.loadOrders();
        this.loadStats();
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

    canUpdate(order: Order): boolean {
        return order.orderStatus === 'PENDING';
    }

    getOrderTotal(order: Order): number {
        return (order as any).totalPrice ?? (order as any).totalAmount ?? 0;
    }

    statusClass(status: string): string {
        if (status === 'PENDING') return 'status-pending';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}