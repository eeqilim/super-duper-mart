import { Component, OnInit } from '@angular/core';
import { Order } from '../../shared/models/order';
import { ApiService } from '../../shared/services/api.service';

type OrderFilter = 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELED';

@Component({
    selector: 'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
    orders: Order[] = [];
    filter: OrderFilter = 'ALL';

    displayedColumns: string[] = [
        'orderId',
        'customer',
        'datePlaced',
        'items',
        'total',
        'orderStatus',
        'actions'
    ];

    message = '';
    errorMessage = '';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.apiService.getOrders().subscribe({
            next: orders => this.orders = orders,
            error: () => this.errorMessage = 'Failed to load orders.'
        });
    }

    setFilter(filter: OrderFilter): void {
        this.filter = filter;
    }

    get filteredOrders(): Order[] {
        return this.filter === 'ALL'
            ? this.orders
            : this.orders.filter(o => o.orderStatus === this.filter);
    }

    completeOrder(orderId: number): void {
        this.apiService.completeOrder(orderId).subscribe({
            next: () => {
                this.message = 'Order completed successfully.';
                this.loadOrders();
            },
            error: () => this.errorMessage = 'Failed to complete order.'
        });
    }

    cancelOrder(orderId: number): void {
        this.apiService.cancelOrder(orderId).subscribe({
            next: () => {
                this.message = 'Order canceled successfully.';
                this.loadOrders();
            },
            error: () => this.errorMessage = 'Failed to cancel order.'
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