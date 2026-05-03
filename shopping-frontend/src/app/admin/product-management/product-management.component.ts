import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from '../../shared/models/product';
import { ApiService } from '../../shared/services/api.service';

@Component({
    selector: 'app-product-management',
    templateUrl: './product-management.component.html',
    styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    products = new MatTableDataSource<Product>([]);

    displayedColumns: string[] = [
        'productId',
        'name',
        'description',
        'quantity',
        'retailPrice',
        'wholesalePrice',
        'actions'
    ];

    showForm = false;
    editingProductId: number | null = null;

    message = '';
    errorMessage = '';

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        quantity: [0, [Validators.required, Validators.min(0)]],
        retailPrice: [0, [Validators.required, Validators.min(0)]],
        wholesalePrice: [0, [Validators.required, Validators.min(0)]]
    });

    constructor(private apiService: ApiService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    ngAfterViewInit(): void {
        this.products.paginator = this.paginator;
    }

    loadProducts(): void {
        this.apiService.getProducts().subscribe({
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
        this.editingProductId = null;
        this.form.reset({
            name: '',
            description: '',
            quantity: 0,
            retailPrice: 0,
            wholesalePrice: 0
        });
    }

    startEdit(product: Product): void {
        this.showForm = true;
        this.editingProductId = product.id;

        this.form.patchValue({
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            retailPrice: product.retailPrice,
            wholesalePrice: product.wholesalePrice ?? 0
        });
    }

    cancelForm(): void {
        this.showForm = false;
        this.editingProductId = null;
        this.form.reset({
            name: '',
            description: '',
            quantity: 0,
            retailPrice: 0,
            wholesalePrice: 0
        });
    }

    saveProduct(): void {
        if (this.form.invalid) {
            return;
        }

        this.message = '';
        this.errorMessage = '';

        const productData: Partial<Product> = this.form.value;

        if (this.editingProductId) {
            this.apiService.updateProduct(this.editingProductId, productData).subscribe({
                next: () => {
                    this.message = 'Product updated successfully.';
                    this.cancelForm();
                    this.loadProducts();
                },
                error: () => {
                    this.errorMessage = 'Failed to update product.';
                }
            });
        } else {
            this.apiService.createProduct(productData).subscribe({
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
    }

    applyFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.products.filter = value.trim().toLowerCase();
    }
}