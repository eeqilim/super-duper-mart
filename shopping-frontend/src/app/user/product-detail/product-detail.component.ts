import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Product } from '../../shared/models/product';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    added = false;
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private cart: CartService,
        public auth: AuthService,
        private location: Location
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.api.getProductById(id).subscribe({
            next: p => this.product = p,
            error: () => this.errorMessage = 'Failed to load product'
        });
    }

    addToCart(): void {
        if (!this.product) return;

        this.cart.addToCart(this.product);
        this.added = true;

        setTimeout(() => this.added = false, 2000);
    }

    addToWatchlist(): void {
        if (!this.product) return;

        this.api.addToWatchlist(this.product.id).subscribe();
    }

    back(): void {
        this.location.back();
    }
}