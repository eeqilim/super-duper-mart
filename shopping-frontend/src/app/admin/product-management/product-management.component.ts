import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../shared/services/api.service';
import { AdminProduct, CreateProductRequest } from 'src/app/shared/models/product';
import { ProductFormValue } from '../product-form/product-form.component';

@Component({
    selector: 'app-product-management',
    templateUrl: './product-management.component.html',
    styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    products = new MatTableDataSource<AdminProduct>([]);

    displayedColumns: string[] = [
        'productId',
        'productName',
        'description',
        'quantity',
        'retailPrice',
        'wholesalePrice',
        'actions'
    ];

    showForm = false;

    message = '';
    errorMessage = '';

    constructor(private apiService: ApiService) { }

    ngOnInit(): void { this.loadProducts(); }

    ngAfterViewInit(): void { this.products.paginator = this.paginator; }

    loadProducts(): void {
        this.apiService.getAdminProducts().subscribe({
            next: products => {
                this.products.data = products;
            },
            error: () => {
                this.errorMessage = 'Failed to load products.';
            }
        });
    }

    openCreateForm(): void {
        this.showForm = true;
    }

    cancelForm(): void {
        this.showForm = false;
    }

    createProduct(value: ProductFormValue): void {
        this.message = '';
        this.errorMessage = '';

        const request = value as CreateProductRequest;

        this.apiService.createProduct(request).subscribe({
            next: () => {
                this.message = 'Product created successfully.';
                this.cancelForm();
                this.loadProducts();
            },
            error: () => {
                this.errorMessage = 'Failed to create product.';
            }
        });
    }

    applyFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.products.filter = value.trim().toLowerCase();
    }
}
