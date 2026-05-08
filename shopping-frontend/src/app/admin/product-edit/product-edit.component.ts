import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminProduct, UpdateProductRequest } from 'src/app/shared/models/product';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
    product: AdminProduct | null = null;
    productId: number | null = null;
    message = '';
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.productId = Number(this.route.snapshot.paramMap.get('id'));

        if (!this.productId) {
            this.errorMessage = 'Invalid product id.';
            return;
        }

        this.apiService.getAdminProductById(this.productId).subscribe({
            next: product => this.product = product,
            error: () => this.errorMessage = 'Failed to load product.'
        });
    }

    updateProduct(request: UpdateProductRequest): void {
        if (!this.productId) return;

        this.message = '';
        this.errorMessage = '';

        this.apiService.updateProduct(this.productId, request).subscribe({
            next: () => {
                this.message = 'Product updated successfully.';
                this.router.navigate(['/admin/products']);
            },
            error: () => {
                this.errorMessage = 'Failed to update product.';
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/admin/products']);
    }
}
