import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOrder } from '../../shared/models/order';
import { ApiService } from '../../shared/services/api.service';

type OrderFilter = 'ALL' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';

@Component({
    selector: 'app-order-management',
    templateUrl: './order-management.component.html',
    styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
    orders: AdminOrder[] = [];
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

    constructor(private apiService: ApiService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const queryFilter = this.route.snapshot.queryParamMap.get('filter');
        if (this.isOrderFilter(queryFilter)) {
            this.filter = queryFilter;
        }

        this.loadOrders();
    }

    loadOrders(): void {
        this.apiService.getAdminOrders().subscribe({
            next: orders => this.orders = orders,
            error: () => this.errorMessage = 'Failed to load orders.'
        });
    }

    setFilter(filter: OrderFilter): void {
        this.filter = filter;
    }

    private isOrderFilter(value: string | null): value is OrderFilter {
        return value === 'ALL'
            || value === 'PROCESSING'
            || value === 'COMPLETED'
            || value === 'CANCELED';
    }

    get filteredOrders(): AdminOrder[] {
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
