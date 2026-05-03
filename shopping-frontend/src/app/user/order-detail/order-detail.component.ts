import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Order } from 'src/app/shared/models/order';
import { OrderItem } from '../../shared/models/order-item';
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
        'product',
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

        this.api.cancelOrder(this.order.id).subscribe({
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
        return this.order?.orderStatus === 'PENDING';
    }

    getSubtotal(item: OrderItem): number {
        return item.purchasedPrice * item.quantity;
    }

    getTotal(): number {
        return this.order?.orderItems.reduce((sum, item) => sum + this.getSubtotal(item), 0) || 0;
    }

    statusClass(status: string): string {
        if (status === 'PENDING') return 'status-pending';
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'CANCELED') return 'status-canceled';
        return '';
    }
}