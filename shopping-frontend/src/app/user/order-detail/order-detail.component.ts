import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Order, OrderItem } from 'src/app/shared/models/order';
import { ApiService } from '../../shared/services/api.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
    order: Order | null = null;
    errorMessage = '';
    message = '';

    displayedColumns: string[] = [
        'productName',
        'price',
        'quantity',
        'subtotal',
        'actions'
    ];

    constructor(private route: ActivatedRoute, private api: ApiService) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.api.getOrderById(id).subscribe({
            next: order => this.order = order,
            error: () => this.errorMessage = 'Failed to load order.'
        });
    }

    cancelOrder(): void {
        if (!this.order) return;

        this.api.cancelOrder(this.order.orderId).subscribe({
            next: () => {
                this.message = 'Order canceled successfully.';
                this.order!.orderStatus = 'CANCELED';
            },
            error: () => {
                this.errorMessage = 'Failed to cancel order.';
            }
        });
    }

    canCancel(): boolean {
        return this.order?.orderStatus === 'PROCESSING';
    }

    getSubtotal(item: OrderItem): number {
        return item.purchasedPrice * item.quantity;
    }

    getTotal(): number {
        return this.order?.order.reduce((sum, item) => sum + this.getSubtotal(item), 0) || 0;
    }

    statusClass(status: string): string {
        if (status === 'PROCESSING') return 'status-processing';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}