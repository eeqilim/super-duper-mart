import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from '../../shared/models/product';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns: string[] = [
        'name',
        'description',
        'quantity',
        'retailPrice',
        'actions'
    ];

    dataSource = new MatTableDataSource<Product>([]);
    watchlist: Product[] = [];

    message = '';
    errorMessage = '';

    constructor(
        private apiService: ApiService,
        private cartService: CartService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        if (this.authService.isAdmin()) {
            this.displayedColumns = [
                'name',
                'description',
                'quantity',
                'retailPrice',
                'wholesalePrice',
                'actions'
            ];
        }

        this.loadProducts();

        if (this.authService.isLoggedIn() && !this.authService.isAdmin()) {
            this.loadWatchlist();
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    loadProducts(): void {
        this.apiService.getProducts().subscribe({
            next: products => {
                this.dataSource.data = products;
            },
            error: () => {
                this.errorMessage = 'Failed to load products.';
            }
        });
    }

    loadWatchlist(): void {
        this.apiService.getWatchlist().subscribe({
            next: products => {
                this.watchlist = products;
            },
            error: () => {
                this.errorMessage = 'Failed to load watchlist.';
            }
        });
    }

    applyFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.dataSource.filter = value.trim().toLowerCase();
    }

    addToCart(product: Product): void {
        this.cartService.addToCart(product);
        this.message = `${product.name} added to cart.`;
    }

    addToWatchlist(productId: number): void {
        this.apiService.addToWatchlist(productId).subscribe({
            next: () => {
                this.message = 'Product added to watchlist.';
                this.loadWatchlist();
            },
            error: () => {
                this.errorMessage = 'Failed to add product to watchlist.';
            }
        });
    }

    removeFromWatchlist(productId: number): void {
        this.apiService.removeFromWatchlist(productId).subscribe({
            next: () => {
                this.watchlist = this.watchlist.filter(
                    product => product.id !== productId
                );
            },
            error: () => {
                this.errorMessage = 'Failed to remove product from watchlist.';
            }
        });
    }
}