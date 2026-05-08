import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
    private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

    cart$ = this.itemsSubject.asObservable();

    get items(): CartItem[] {
        return this.itemsSubject.value;
    }

    get count(): number {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    get total(): number {
        return this.items.reduce((total, item) => total + item.product.retailPrice * item.quantity, 0);
    }

    reloadCart(): void {
        this.itemsSubject.next(this.loadCart());
    }

    private getStorageKey(): string {
        const raw = localStorage.getItem('current_user');

        if (!raw) return 'shopping_cart_guest';

        try {
            const user = JSON.parse(raw);
            return `shopping_cart_${user.username}`;
        } catch {
            return 'shopping_cart_guest';
        }
    }

    addToCart(product: Product, quantity = 1): void {
        const cart = [...this.items];
        const existingIndex = cart.findIndex(item => item.product.productId === product.productId);

        if (existingIndex > -1) {
            cart[existingIndex] = {
                ...cart[existingIndex],
                quantity: cart[existingIndex].quantity + quantity
            };
        } else {
            cart.push({ product, quantity });
        }

        this.saveCart(cart);
    }

    updateQuantity(productId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const cart = this.items.map(item =>
            item.product.productId === productId
                ? { ...item, quantity }
                : item
        );

        this.saveCart(cart);
    }

    removeFromCart(productId: number): void {
        const cart = this.items.filter(item => item.product.productId !== productId);
        this.saveCart(cart);
    }

    clearCart(): void {
        this.saveCart([]);
    }

    toOrderItems(): { productId: number; quantity: number }[] {
        return this.items.map(item => ({ productId: item.product.productId, quantity: item.quantity }));
    }

    private saveCart(cart: CartItem[]): void {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(cart));
        this.itemsSubject.next(cart);
    }

    private loadCart(): CartItem[] {
        const raw = localStorage.getItem(this.getStorageKey());

        if (!raw) return [];

        try {
            return JSON.parse(raw) as CartItem[];
        } catch {
            localStorage.removeItem(this.getStorageKey());
            return [];
        }
    }
}