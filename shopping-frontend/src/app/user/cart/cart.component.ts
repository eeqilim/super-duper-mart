import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartItem } from '../../shared/models/cart';
import { CartService } from '../../shared/services/cart.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    errorMessage = '';
    loading = false;

    displayedColumns: string[] = [
        'product',
        'price',
        'quantity',
        'subtotal',
        'actions'
    ];

    constructor(public cartService: CartService, private apiService: ApiService, private router: Router) { }

    ngOnInit(): void {
        this.cartService.cart$.subscribe(items => {
            this.cartItems = items;
        });
    }

    increaseQuantity(item: CartItem): void {
        this.cartService.updateQuantity(
            item.product.productId,
            item.quantity + 1
        );
    }

    decreaseQuantity(item: CartItem): void {
        this.cartService.updateQuantity(
            item.product.productId,
            item.quantity - 1
        );
    }

    updateQuantity(item: CartItem, value: string): void {
        const quantity = Number(value);

        if (Number.isNaN(quantity)) {
            return;
        }

        this.cartService.updateQuantity(item.product.productId, quantity);
    }

    removeItem(productId: number): void {
        this.cartService.removeFromCart(productId);
    }

    clearCart(): void {
        this.cartService.clearCart();
    }

    placeOrder(): void {
        const items = this.cartService.toOrderItems();

        if (items.length === 0) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.apiService.placeOrder(items).subscribe({
            next: order => {
                this.loading = false;
                this.cartService.clearCart();
                this.router.navigate(['/orders', order.orderId]);
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Failed to place order.';
            }
        });
    }
}